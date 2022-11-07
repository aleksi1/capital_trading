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

/**
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
*/

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
  /* dataArray.sort((a, b) => {
    const c = new Date(a.date)
    const d = new Date(b.date)
    return d.valueOf() - c.valueOf()
  }).reverse() */
  console.log(dataArray)

  Object.values(dataArray).forEach((chartData) => {
    if (intervalType === 'day') {
      const { date } = chartData
      const key = getKey(date)
      console.log(`${key} => ${date}`)
      chartData.values.forEach((v) => {
        if (!newArray[key]) newArray[key] = []
        if (!newArray[key][v.key]) newArray[key][v.key] = []
        /*
        const newValue = v.value
        if (v.type === 'sum') {
          newValue = v.value ?? 0 + parseFloat(newArray[key][v.key] ?? 0)
        } */

        newArray[key].date = date
        newArray[key][v.key].push({
          value: v.value,
        })
        // newArray[key][v.key] = newValue
        // newArray[key].name = key
        // console.log(`${key} - ${v.key} = ${newValue}`)
      })
    }
  })

  /* newArray.sort((a: any, b: any) => {
    const ad = new Date(a.date)
    const bd = new Date(b.date)
    return ad.valueOf() - bd.valueOf()
  }) */
  console.log(newArray)

  const result: any = []

  Object.keys(newArray).forEach((key) => {
    const value: any = newArray[key]
    // console.log(chartData)
    // Get latest balance
    /* chartData.Balance.sort((a: any, b: any) => {
      const ad = new Date(a.name)
      const bd = new Date(b.name)
      return ad.valueOf() - bd.valueOf()
    }).reverse() */
    // console.log(chartData.Balance)
    // console.log(chartData.Balance[0])

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
  console.log(result)
  return result
}
