import {
  Box, Button, Card, Chip, Table, TableBody, TableCell, TableHead, TableRow, TextField,
} from '@mui/material'
import { ChangeEvent, useEffect, useState } from 'react'
import { formatNumber } from '../Helper/Helper'
import { Layout } from '../Components/Layout'

const Simulator = () => {
  const initialSettings = {
    initialDeposit: 1000,
    trades: 20,
    takeProfit: 5,
    stopLoss: 2,
    estimatedSuccessRate: 60,
  }
  const [settings, setSettings] = useState(initialSettings)
  const [tableData, setTableData] = useState([])

  useEffect(() => {
    const storedSettings = localStorage.getItem('settings')
    if (storedSettings) {
      const obj = { ...initialSettings, ...JSON.parse(storedSettings) }
      setSettings(obj)
    }
  }, [])

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newSettings = { ...settings, [e.target.name]: e.target.value }
    localStorage.setItem('settings', JSON.stringify(newSettings))
    setSettings(newSettings)
  }

  const onClick = () => {
    const newTableData: any = []
    let cumulativeProfits = settings.initialDeposit
    for (let i = 0; i < settings.trades; i += 1) {
      const randomNumber = Math.random() * 100
      const success = randomNumber <= settings.estimatedSuccessRate
      const previousProfits = cumulativeProfits
      if (success) {
        cumulativeProfits *= (1 + (settings.takeProfit / 100))
      } else {
        cumulativeProfits *= (1 - (settings.stopLoss / 100))
      }
      newTableData.push({
        randomNumber,
        success,
        change: `${formatNumber(cumulativeProfits - previousProfits)} €`,
        amount: `${formatNumber(cumulativeProfits)} €`,
        index: i + 1,
      })
    }
    setTableData(newTableData.reverse())
  }

  return (
    <Layout>
      <Card sx={{ marginBottom: '10px', maxWidth: '100%' }}>
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
              id="outlined-disabled"
              label="Initial deposit"
              name="initialDeposit"
              value={settings.initialDeposit}
              onChange={onChange}
            />
            <TextField
              id="outlined-disabled"
              label="Trades"
              name="trades"
              value={settings.trades}
              onChange={onChange}
            />
            <TextField
              id="outlined-disabled"
              label="Take profit"
              name="takeProfit"
              value={settings.takeProfit}
              onChange={onChange}
            />
            <TextField
              id="outlined-disabled"
              label="Stop loss"
              name="stopLoss"
              value={settings.stopLoss}
              onChange={onChange}
            />
            <TextField
              id="outlined-disabled"
              label="Estimated success rate"
              name="estimatedSuccessRate"
              value={settings.estimatedSuccessRate}
              onChange={onChange}
            />
            <Button
              variant="contained"
              component="label"
              style={{ marginTop: '15px' }}
              onClick={onClick}
            >
              Simulate
            </Button>
          </div>
        </Box>
      </Card>
      <Card sx={{ marginBottom: '10px', maxWidth: '100%' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Trade</TableCell>
              <TableCell>Change</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((value: any) => (
              <TableRow>
                <TableCell>
                  <Chip color="info" label={value.index} />
                </TableCell>
                <TableCell>
                  {value.success
                    ? <Chip color="success" label={value.change} />
                    : <Chip color="error" label={value.change} /> }
                </TableCell>
                <TableCell>
                  {value.amount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </Layout>
  )
}

export default Simulator
