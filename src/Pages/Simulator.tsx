import {
  Box, Button, Card, Chip, Grid, Link, TextField, Typography,
} from '@mui/material'
import Container from '@mui/material/Container'
import { ChangeEvent, useEffect, useState } from 'react'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import { formatNumber } from '../Helper/Helper'

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
    <>
      <Container maxWidth="lg" sx={{ mt: 10 }}>
        <Card sx={{ marginBottom: '10px', maxWidth: '100%' }}>
          <Grid container spacing={2}>
            <Grid xs={10}>
              <Typography sx={{ m: 2 }} variant="h5" component="div">
                <ShowChartIcon sx={{ verticalAlign: 'middle' }} />
                <Link href="/" style={{ textDecoration: 'none' }}>{' Trading'}</Link>
                {' / Simulator'}
              </Typography>
            </Grid>
          </Grid>
        </Card>
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
        {tableData.map((value: any) => (
          <Card sx={{ margin: '10px 0', maxWidth: '100%' }}>
            <Grid container spacing={2}>
              <Grid style={{ marginRight: '5px' }}>
                <Chip color="info" label={value.index} />
              </Grid>
              <Grid xs={1}>
                {value.success
                  ? <Chip color="success" label={value.change} />
                  : <Chip color="error" label={value.change} /> }
              </Grid>
              <Grid md={2}>
                {value.amount}
              </Grid>
            </Grid>
          </Card>
        ))}
      </Container>
    </>
  )
}

export default Simulator
