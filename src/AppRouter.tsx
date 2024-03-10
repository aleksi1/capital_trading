import {
  HashRouter, Route, Routes,
} from 'react-router-dom'
import Trading from './Pages/Trading'
import Simulator from './Pages/Simulator'

const AppRouter = () => (
  <HashRouter>
    <Routes>
      <Route path="/" element={<Trading />} />
      <Route path="/simulator" element={<Simulator />} />
    </Routes>
  </HashRouter>
)

export default AppRouter
