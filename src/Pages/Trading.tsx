import { useHistory } from 'react-router-dom'
import {
  Box, Button, Card, Chip, FormControl, Grid, MenuItem, Select, SelectChangeEvent, TextField,
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
import {
  ChangeEvent, forwardRef, useEffect, useState,
} from 'react'
import DatePicker from 'react-datepicker'
import { parse } from '../Helper/ParseCsv'
import { roundTo } from '../Helper/Helper'
import ProfitChart from '../Components/ProfitChart'
import { AccountDetails } from '../Types/Trading'
import 'react-datepicker/dist/react-datepicker.css'
import {
  calculateData, calculateTaxableIncome, calculateTaxes, getTaxRate, getTaxYears, getTypeName,
} from '../Helper/CalculateData'
import { areas } from '../Helper/ChartData'
import DarkModeSwitch from '../Components/DarkModeSwitch'

const Trading = () => {
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString())
  const [startDate, setStartDate] = useState<Date>(new Date(`01/01/${new Date().getFullYear()}`))
  const [endDate, setEndDate] = useState<Date>(new Date())

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const DatePickerCustomInput = forwardRef(({ value, onClick }: any, ref: any) => (
    <TextField
      id="outlined-basic"
      sx={{ mt: 2 }}
      size="small"
      value={value}
      label=""
      variant="outlined"
      onClick={onClick}
      ref={ref}
    />
  ))

  const history = useHistory()

  const [uploadedResults, setUploadedResults] = useState<any>()
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

  const [taxYear, setTaxYear] = useState<string>(`${new Date().getFullYear()}`)

  const handleYearChange = (event: SelectChangeEvent) => {
    setSelectedYear(event.target.value)
    const sd = new Date(`01/01/${event.target.value}`)
    setStartDate(sd)
    setEndDate(new Date(sd.getFullYear(), 11, 31))
    setTaxYear(event.target.value)
  }

  const changeHandler = (event: ChangeEvent) => {
    const target = event.target as HTMLInputElement
    if (target?.files) {
      parse(target?.files[0], (results: any) => {
        setUploadedResults(results.data)
      })
    }
  }

  const updateData = () => {
    const result = calculateData(uploadedResults, startDate, endDate)
    if (result?.cnames) setColumnNames(result.cnames)
    if (result?.rowValues) setTableRows(result.rowValues)
    if (result?.newAccountDetails) setAccountDetails(result.newAccountDetails)
    if (result?.currentChartData) setChartData(result.currentChartData)
  }

  useEffect(() => {
    updateData()
  }, [uploadedResults, startDate, endDate])

  const getValue = (value: string, name: string) => {
    const allowedFields = ['Amount', 'Balance', 'Percentage']
    // eslint-disable-next-line no-param-reassign
    if (name === 'Type') value = getTypeName(value.toLowerCase())
    if (!allowedFields.includes(name) || value === '') return <>{value}</>
    const amount = roundTo(parseFloat(value), 2)
    const suffix = name === 'Percentage' ? '%' : ' €'
    if (name === 'Balance') {
      return <div style={{ color: '#1a75ff', fontWeight: 'bold' }}>{`${amount}${suffix}`}</div>
    }
    if (amount >= 0) {
      return <div style={{ color: 'lightgreen', fontWeight: 'bold' }}>{`${amount}${suffix}`}</div>
    }
    return <div style={{ color: 'red', fontWeight: 'bold' }}>{`${amount}${suffix}`}</div>
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 10 }}>
      <Card sx={{ marginBottom: '10px', maxWidth: '100%' }}>
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <Typography sx={{ m: 2 }} variant="h5" component="div">
              <ShowChartIcon sx={{ verticalAlign: 'middle' }} />
              {' Trading'}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Grid container>
              <Grid item xs={6}>
                <Select
                  labelId="year-select-label"
                  id="year-select"
                  value={selectedYear}
                  label="Year"
                  size="small"
                  sx={{ mt: 2 }}
                  onChange={handleYearChange}
                  defaultValue={`${new Date().getFullYear() - 1}`}
                >
                  {getTaxYears()?.map((e: number) => <MenuItem key={`tax-year-${e}`} value={e}>{e}</MenuItem>)}
                </Select>
              </Grid>
              <Grid item xs={6} style={{ marginTop: '10px' }}>
                <DarkModeSwitch />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={2}>
            <DatePicker
              selected={startDate}
              onChange={(date: Date) => setStartDate(date)}
              selectsStart
              showMonthDropdown
              showYearDropdown
              startDate={startDate}
              endDate={endDate}
              customInput={<DatePickerCustomInput />}
            />
          </Grid>
          <Grid item xs={2}>
            <DatePicker
              selected={endDate}
              onChange={(date: Date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              customInput={<DatePickerCustomInput />}
            />
          </Grid>
          <Grid item xs={2} sx={{ mt: 2 }}>
            <Button variant="outlined" onClick={() => history.push('/#/simulator')}>Simulator</Button>
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

      {chartData?.length > 0 ? <ProfitChart data={chartData} areas={areas} /> : ''}

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
              value={` ${roundTo(accountDetails?.balance, 2)} € `}
            />

            <TextField
              InputProps={{
                readOnly: true,
              }}
              id="outlined-disabled"
              label="Wins"
              value={` ${accountDetails?.winningTrades} (${roundTo(accountDetails?.wins, 2)} €) `}
            />

            <TextField
              InputProps={{
                readOnly: true,
              }}
              id="outlined-disabled"
              label="Losses"
              value={` ${accountDetails?.losingTrades} (${roundTo(accountDetails?.losses, 2)} €)`}
            />
            <TextField
              InputProps={{
                readOnly: true,
              }}
              id="outlined-disabled"
              label="Deposits"
              value={` ${roundTo(accountDetails?.deposits, 2)} €`}
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
              value={` ${roundTo(accountDetails?.fees, 2) * -1} €`}
            />
          </div>
        </Box>
        <Box
          component="form"
          sx={{ m: 1 }}
          noValidate
          autoComplete="off"
        >
          <TextField
            InputProps={{
              readOnly: true,
            }}
            id="outlined-disabled"
            label="Tax Year"
            sx={{ mr: 2 }}
            value={taxYear}
          />
          <FormControl sx={{ mr: 2 }}>
            <TextField
              InputProps={{
                readOnly: true,
              }}
              id="outlined-disabled"
              label={`Taxeable income in year ${taxYear ?? ''}`}
              value={` ${roundTo(calculateTaxableIncome(uploadedResults, taxYear), 2)} €`}
            />
          </FormControl>
          <FormControl sx={{ mr: 2 }}>
            <TextField
              InputProps={{
                readOnly: true,
              }}
              id="outlined-disabled"
              label={`Payable taxes in year ${taxYear ?? ''}`}
              value={` ${roundTo(calculateTaxes(uploadedResults, taxYear), 2)} €`}
            />
          </FormControl>
          <FormControl sx={{ mr: 2 }}>
            <TextField
              InputProps={{
                readOnly: true,
              }}
              id="outlined-disabled"
              label={`Tax rate in year ${taxYear ?? ''}`}
              value={` ${getTaxRate(uploadedResults, taxYear) * 100} %`}
            />
          </FormControl>
        </Box>
      </Card>

      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {columnNames?.map((value: any) => {
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
            {tableRows?.map((row: any) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {row?.map((value: any, index: number) => {
                  const columnName = columnNames[index]
                  if (columnName === 'Id') return ''
                  const getAlignment = (name: string): 'left' | 'right' | 'inherit' | 'center' | 'justify' | undefined => {
                    switch (name) {
                      case 'Type':
                        return 'center'
                      default:
                        return 'right'
                    }
                  }
                  return (
                    <TableCell key={`body-cell-${row[0]}-${columnName}`} align={getAlignment(columnName)}>
                      {getValue(value, columnName)}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}

export default Trading
