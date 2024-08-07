import {
  HashRouter, Route, Routes,
} from 'react-router-dom'
import TradingReport from './Pages/TradingReport'
import Simulator from './Pages/Simulator'
import Warrant from './Pages/Warrant'

const AppRouter = () => (
  <HashRouter>
    <Routes>
      <Route path="/" element={<TradingReport />} />
      <Route path="/simulator" element={<Simulator />} />
      <Route path="/warrant" element={<Warrant />} />
    </Routes>
  </HashRouter>
)

export default AppRouter
