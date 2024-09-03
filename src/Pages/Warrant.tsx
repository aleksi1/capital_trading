import {
  Card, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useState } from 'react'
import { Layout } from '../Components/Layout'
import { isNumeric, roundTo } from '../Helper/Helper'
import { isValidNumber } from '../Helper/WarrantHelper'

const Warrant = () => {
  const [data, setData] = useState({
    price: 0,
    qty: 0,
    percent: 10,
  })
  const inputChange = (event: any) => {
    const value = event.target.value?.replace(/,/g, '.')
    if (isValidNumber(value)) {
      setData((prevState) => ({
        ...prevState,
        [event.target.name]: isNumeric(value) && !Number.isNaN(value) ? value : 0,
      }))
    }
  }
  const calculatePriceIncrease = (originalPrice: any, percentageIncrease: any) => {
    const increase = parseFloat(originalPrice) * (parseFloat(percentageIncrease) / 100)
    const newPrice = parseFloat(originalPrice) + increase
    return newPrice
  }
  const calculate = () => {
    const increase = calculatePriceIncrease(data.price * data.qty, data.percent)
    return increase - (data.price * data.qty)
  }
  // const getTableData = () => (data.price ? calculatePriceTable(data.price, 1) : [])
  return (
    <Layout>
      <Card sx={{ paddingTop: '10px', marginBottom: '20px', maxWidth: '100%' }}>
        <Grid container spacing={2} sx={{ ml: 3, marginBottom: '10px' }}>
          <Grid md={1}>
            <TextField
              id="outlined-disabled"
              label="Price"
              name="price"
              value={data.price}
              onChange={inputChange}
            />
          </Grid>
          <Grid md={1}>
            <TextField
              id="outlined-disabled"
              label="Qty"
              name="qty"
              value={data.qty}
              onChange={inputChange}
            />
          </Grid>
          <Grid md={1}>
            <TextField
              id="outlined-disabled"
              label="Percent"
              name="percent"
              value={data.percent}
              onChange={inputChange}
            />
          </Grid>
          <Grid md={1}>
            <TextField
              InputProps={{
                readOnly: true,
              }}
              label="New price"
              id="outlined-disabled"
              value={roundTo(calculatePriceIncrease(data.price, data.percent), 2)}
            />
          </Grid>
          <Grid md={1}>
            <TextField
              InputProps={{
                readOnly: true,
              }}
              label="Profit/loss"
              id="outlined-disabled"
              value={roundTo(calculate(), 2)}
            />
          </Grid>
        </Grid>
      </Card>
      <Card sx={{ display: 'none' }}>
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  test
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody />
          </Table>
        </TableContainer>
      </Card>
    </Layout>
  )
}

export default Warrant
