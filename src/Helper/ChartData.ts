export type IntervalType = 'day' | 'hour'

export type DataValue = {
  key: string
  value: number
  type: 'sum' | 'latest'
}

export type ChartData = {
  date: Date
  values: DataValue[]
}

const pad = (n: number) => (n < 10 ? `0${n}` : n)

const getKey = (date: Date) => `${pad(date.getFullYear())}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

/**
 * Sorts chart data by day or hour to correct keys
 * @param intervalType
 * @param dataArray
 * @param array
 * @returns
 */
export const parseChartData = (intervalType: IntervalType, dataArray: ChartData[]) => {
  const newArray: any = []
  dataArray.reverse()
  Object.values(dataArray).forEach((chartData) => {
    if (intervalType === 'day') {
      const { date } = chartData
      const key = getKey(date)
      chartData.values.forEach((v) => {
        if (!newArray[key]) newArray[key] = []
        if (!newArray[key][v.key]) newArray[key][v.key] = []
        newArray[key].date = date
        newArray[key][v.key].push({
          value: v.value,
        })
      })
    }
  })
  const result: any = []

  Object.keys(newArray).forEach((key) => {
    const value: any = newArray[key]
    // Sum all amounts
    let amount = 0
    value.Amount.forEach((a: any) => {
      amount += parseFloat(a.value ?? 0)
    })

    value.Balance.reverse()

    result.push({
      name: getKey(value.date),
      Balance: value.Balance[0].value,
      Amount: amount,
    })
  })
  return result
}

export const areas = [
  {
    dataKey: 'Balance',
    stackId: '1',
    stroke: '#1a75ff',
    fill: '#1a75ff',
  },
]
