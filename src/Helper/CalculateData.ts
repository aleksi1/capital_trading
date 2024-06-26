import { AccountDetails } from '../Types/Trading'
import { ChartData, parseChartData } from './ChartData'
import { calculatePercentage } from './Helper'

const addToAverage = (average: number, value: number, count: number) => {
  const newAverage = (count === 1 ? value : average + ((value - average) / count))
  return Number.isNaN(newAverage) || !Number.isFinite(newAverage) ? 0 : newAverage
}

export const roundTo2Decimals = (n: number) => Math.round(n * 100) / 100

const getAccountType = (type: string) => ({ demo_transfer: 'Demo', deposit: 'Live' }[type] ?? 'Live')

export const getTaxYears = () => {
  const year = new Date().getFullYear()
  const values: number[] = []
  for (let i = year - 5; i <= year + 5; i += 1) {
    values.push(i)
  }
  return values
}

export const calculateData = (uploadedResults: any, startDate: Date, endDate: Date) => {
  if (!uploadedResults) return
  const rowValues: any = []
  const currentChartData: ChartData[] = []
  const removedAttributes = [
    // 'Id',
    'Trade Id',
    'Currency',
    'Instrument Symbol',
    'Status',
    // 'Modified',
    'Account type',
    'Commission',
  ]

  const newAccountDetails: AccountDetails = {
    type: '',
    balance: 0,
    deposits: 0,
    totalTrades: 0,
    winningTrades: 0,
    losingTrades: 0,
    wins: 0,
    losses: 0,
    fees: 0,
    averageWinPercentage: 0,
    averageLossPercentage: 0,
    successRate: 0,
    yearlyProfitPercentage: 0,
  }

  let startBalance: number | undefined
  let endBalance: number | undefined
  uploadedResults.forEach((obj: any) => {
    const d = obj
    removedAttributes.forEach((attr) => {
      delete d[attr]
    })
    const type = d.Type.toLowerCase()
    newAccountDetails.type = getAccountType(type)

    const amount = parseFloat(d.Amount)
    const date = new Date(d.Modified)

    if (date >= startDate && date <= endDate) {
      if (!endBalance) endBalance = parseFloat(d.Balance)
      else {
        startBalance = parseFloat(d.Balance) - amount
      }

      const isTrade = type === 'trade'
      const isFee = ['swap', 'corporate_action'].includes(type)
      const isNonTrade = ['trade_correction', 'swap', 'corporate_action'].includes(type)
      const isDeposit = ['demo_transfer', 'deposit'].includes(type)
      d.Percentage = !isDeposit ? calculatePercentage(amount, parseFloat(d.Balance)) : ''
      rowValues.push(Object.values(d))

      if (isFee && amount < 0) {
        newAccountDetails.fees += amount
      }

      if (isTrade || isNonTrade) {
        if (isTrade) newAccountDetails.totalTrades += 1
        if (amount >= 0) {
          if (isTrade) newAccountDetails.winningTrades += 1
          newAccountDetails.wins += amount
          newAccountDetails.averageWinPercentage = addToAverage(newAccountDetails.averageWinPercentage, d.Percentage, newAccountDetails.winningTrades)
        } else {
          if (isTrade) newAccountDetails.losingTrades += 1
          newAccountDetails.losses += amount
          newAccountDetails.averageLossPercentage = addToAverage(newAccountDetails.averageLossPercentage, d.Percentage, newAccountDetails.losingTrades)
        }
      } else if (isDeposit) {
        newAccountDetails.deposits += amount
      }

      currentChartData.push({
        date,
        values: [
          {
            key: 'Amount',
            value: amount,
            type: 'sum',
          },
          {
            key: 'Balance',
            value: d.Balance,
            type: 'latest',
          },
        ],
      })
      if (!newAccountDetails.balance) newAccountDetails.balance = d.Balance
    }
  })

  const firstRow: any = uploadedResults[0] ?? {}
  const cnames: any = Object.keys(firstRow)
  newAccountDetails.successRate = (newAccountDetails.winningTrades / newAccountDetails.totalTrades) * 100

  const calculateProfitOrLossPercentage = (sb: number, eb: number, deposits: number) => {
    const netProfitOrLoss = eb - sb - deposits
    const percentageChange = (netProfitOrLoss / sb) * 100
    return roundTo2Decimals(percentageChange)
  }
  newAccountDetails.yearlyProfitPercentage = calculateProfitOrLossPercentage(startBalance ?? 0, endBalance ?? 0, newAccountDetails.deposits)
  // eslint-disable-next-line consistent-return
  return {
    cnames, rowValues, newAccountDetails, currentChartData: parseChartData('day', currentChartData),
  }
}

export const getTypeName = (type: string) => {
  const types: { [key: string]: string } = {
    trade: 'Trade',
    swap: 'Overnight fee',
    trade_correction: 'Trade correction',
    corporate_action: 'Dividend',
    deposit: 'Deposit',
    demo_transfer: 'Demo transfer',
  }
  return types[type] ? types[type] : ''
}

export const getColumnNameOverrides: any = () => ({ Modified: 'Date' })

export const calculateTaxableIncome = (uploadedResults: any, taxYear: string) => {
  let value = 0
  uploadedResults?.forEach((obj: any) => {
    const d = obj
    const amount = parseFloat(d.Amount)
    const date = new Date(d.Modified)
    const type = d.Type.toLowerCase()
    const allowedTypes = ['trade', 'swap', 'trade_correction', 'corporate_action']

    if (taxYear && date.getFullYear() === parseInt(taxYear, 10)) {
      if (allowedTypes.includes(type)) {
        if (amount >= 0) {
          value += amount
        }
      }
    }
  })
  return value
}

export const getTaxRate = (uploadedResults: any, taxYear: string, i?: number) => {
  const income = i ?? calculateTaxableIncome(uploadedResults, taxYear)
  return income <= 30000 ? 0.30 : 0.34
}

export const calculateTaxes = (uploadedResults: any, taxYear: string) => {
  const income = calculateTaxableIncome(uploadedResults, taxYear)
  const taxRate = getTaxRate(uploadedResults, taxYear, income)
  return income * taxRate
}
