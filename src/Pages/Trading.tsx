import {
  Box, Button, Card, Chip, Grid, Link, TextField,
} from '@mui/material'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { useState } from 'react'
import { parse } from '../Helper/ParseCsv'
import { calculatePercentage, roundTo } from '../Helper/Helper'
import ProfitChart from '../Components/ProfitChart'
import { parseChartData, ChartData } from '../Helper/ChartData'
import { AccountDetails } from '../Types/Trading'

const Trading = () => {
  const [columnNames, setColumnNames] = useState([])
  const [accountDetails, setAccountDetails] = useState<AccountDetails>({
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
  })
  const [tableRows, setTableRows] = useState([])
  const [chartData, setChartData] = useState([])

  const addToAverage = (average: number, value: number, count: number) => (count === 1 ? value
    : average + ((value - average) / count))

  const changeHandler = (event: any) => {
    parse(event.target.files[0], (results: any) => {
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
      const noPercentage = [
        'demo_transfer',
        'deposit',
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
      }

      results.data.forEach((obj: any) => {
        const d = obj
        removedAttributes.forEach((attr) => {
          delete d[attr]
        })
        const type = d.Type.toLowerCase()
        if (type === 'demo_transfer') newAccountDetails.type = 'Demo'
        if (type === 'deposit') newAccountDetails.type = 'Live'

        const amount = parseFloat(d.Amount)
        const date = new Date(d.Modified)
        d.Percentage = !noPercentage.includes(type) ? calculatePercentage(amount, parseFloat(d.Balance)) : ''
        rowValues.push(Object.values(d))
        if (type === 'swap') {
          newAccountDetails.fees += amount
        }
        if (type === 'trade') {
          newAccountDetails.totalTrades += 1
          if (amount >= 0) {
            newAccountDetails.winningTrades += 1
            newAccountDetails.wins += amount
            newAccountDetails.averageWinPercentage = addToAverage(
              newAccountDetails.averageWinPercentage, d.Percentage, newAccountDetails.winningTrades,
            )
          } else {
            newAccountDetails.losingTrades += 1
            newAccountDetails.losses += amount
            newAccountDetails.averageLossPercentage = addToAverage(
              newAccountDetails.averageLossPercentage, d.Percentage, newAccountDetails.losingTrades,
            )
          }
        } else if (noPercentage.includes(type)) {
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
      })
      const firstRow: any = results.data[0]
      const cnames: any = Object.keys(firstRow)
      setColumnNames(cnames)
      setTableRows(rowValues)
      newAccountDetails.balance = results.data[0].Balance
      newAccountDetails.successRate = (newAccountDetails.winningTrades / newAccountDetails.totalTrades) * 100
      setAccountDetails(newAccountDetails)
      setChartData(parseChartData('day', currentChartData))
    })
  }

  const getPrice = (value: any, name: string) => {
    const allowedFields = ['Amount', 'Balance', 'Percentage']
    if (!allowedFields.includes(name) || value === '') return <>{value}</>
    const amount = roundTo(parseFloat(value), 2)
    const suffix = name === 'Percentage' ? '%' : ' ???'
    if (name === 'Balance') {
      return <div style={{ color: '#1a75ff', fontWeight: 'bold' }}>{`${amount}${suffix}`}</div>
    }
    if (amount >= 0) {
      return <div style={{ color: 'lightgreen', fontWeight: 'bold' }}>{`${amount}${suffix}`}</div>
    }
    return <div style={{ color: 'red', fontWeight: 'bold' }}>{`${amount}${suffix}`}</div>
  }

  const areas = [
    /* {
      dataKey: 'amount',
      stackId: '1',
      stroke: '#8884d8',
      fill: '#8884d8',
    }, */
    {
      dataKey: 'Balance',
      stackId: '1',
      stroke: '#1a75ff',
      fill: '#1a75ff',
    },
  ]

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 10 }}>
        <Card sx={{ marginBottom: '10px', maxWidth: '100%' }}>

          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Typography sx={{ m: 2 }} variant="h5" component="div">
                <ShowChartIcon sx={{ verticalAlign: 'middle' }} />
                {' Trading'}
              </Typography>
            </Grid>
            <Grid item xs={2} sx={{ mt: 3 }}>
              <Link href="/simulator">Simulator</Link>
            </Grid>
            <Grid item xs={2}>
              {' '}
              <Button
                variant="contained"
                component="label"
                style={{ marginTop: '15px' }}
              >
                Upload File
                <input
                  type="file"
                  name="file"
                  onChange={changeHandler}
                  accept=".csv"
                  style={{ display: 'none' }}
                />
              </Button>
            </Grid>
          </Grid>

        </Card>

        {chartData.length > 0 ? <ProfitChart data={chartData} areas={areas} /> : ''}

        <Card sx={{ marginBottom: '10px', maxWidth: '100%' }}>
          <Typography sx={{ m: 2 }} variant="h5" component="div">
            Account details
            {accountDetails.type ? <Chip sx={{ ml: 2 }} color="info" label={accountDetails.type} /> : ''}
          </Typography>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField
                InputProps={{
                  readOnly: true,
                }}
                id="outlined-disabled"
                label="Balance"
                value={` ${roundTo(accountDetails?.balance, 2)} ??? `}
              />

              <TextField
                InputProps={{
                  readOnly: true,
                }}
                id="outlined-disabled"
                label="Wins"
                value={` ${accountDetails?.winningTrades} (${roundTo(accountDetails?.wins, 2)} ???) `}
              />

              <TextField
                InputProps={{
                  readOnly: true,
                }}
                id="outlined-disabled"
                label="Losses"
                value={` ${accountDetails?.losingTrades} (${roundTo(accountDetails?.losses, 2)} ???)`}
              />
              <TextField
                InputProps={{
                  readOnly: true,
                }}
                id="outlined-disabled"
                label="Deposits"
                value={` ${roundTo(accountDetails?.deposits, 2)} ???`}
              />
              <TextField
                InputProps={{
                  readOnly: true,
                }}
                id="outlined-disabled"
                label="Average win %"
                value={` ${roundTo(accountDetails?.averageWinPercentage, 2)} %`}
              />
              <TextField
                InputProps={{
                  readOnly: true,
                }}
                id="outlined-disabled"
                label="Average loss %"
                value={` ${roundTo(accountDetails?.averageLossPercentage, 2)} %`}
              />
              <TextField
                InputProps={{
                  readOnly: true,
                }}
                id="outlined-disabled"
                label="Success rate %"
                value={` ${roundTo(accountDetails?.successRate, 2)} %`}
              />
              <TextField
                InputProps={{
                  readOnly: true,
                }}
                id="outlined-disabled"
                label="Fees"
                value={` ${roundTo(accountDetails?.fees, 2) * -1} ???`}
              />
            </div>
          </Box>

        </Card>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                {columnNames.map((value: any) => {
                  if (value === 'Id') return ''
                  return (
                    <TableCell key={`hc-${value}`} align="right">
                      {value}
                    </TableCell>
                  )
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableRows.map((row: any) => (
                <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  {row.map((value: any, index: number) => {
                    if (columnNames[index] === 'Id') return ''
                    return (
                      <TableCell key={`body-cell-${row[0]}-${columnNames[index]}`} align="right">
                        {getPrice(value, columnNames[index])}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  )
}

export default Trading
