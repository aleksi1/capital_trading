import {
  HashRouter, Route, Routes,
} from 'react-router-dom'
import TradingReport from './Pages/TradingReport'
import Simulator from './Pages/Simulator'

const AppRouter = () => (
  <HashRouter>
    <Routes>
      <Route path="/" element={<TradingReport />} />
      <Route path="/simulator" element={<Simulator />} />
    </Routes>
  </HashRouter>
)

export default AppRouter
