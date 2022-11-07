import {
  BrowserRouter, Route, Switch,
} from 'react-router-dom'
import Trading from './Pages/Trading'
import Simulator from './Pages/Simulator'

const rootPath = 'capital_trading'

const AppRouter = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path={`/${rootPath}/`} component={Trading} />
      <Route exact path={`/${rootPath}/simulator`} component={Simulator} />
    </Switch>
  </BrowserRouter>
)

export default AppRouter
