import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts'

const ProfitChart = (props: any) => {
  const { data, areas } = props
  return (
    <>
      <AreaChart
        width={1180}
        height={400}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        {areas.map((area: any) => (
          <Area
            key={area.dataKey}
            type="monotone"
            dataKey={area.dataKey}
            stackId={area.stackId}
            stroke={area.stroke}
            fill={area.fill}
          />
        ))}
      </AreaChart>
    </>
  )
}

export default ProfitChart
