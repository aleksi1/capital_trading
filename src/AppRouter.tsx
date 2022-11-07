import {
  HashRouter, Route, Switch,
} from 'react-router-dom'
import Trading from './Pages/Trading'
import Simulator from './Pages/Simulator'

const rootPath = 'capital_trading'

const AppRouter = () => (
  <HashRouter>
    <Switch>
      <Route exact path={`/${rootPath}`} component={Trading} />
      <Route exact path={`/${rootPath}/simulator`} component={Simulator} />
    </Switch>
  </HashRouter>
)

export default AppRouter
