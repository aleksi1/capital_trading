import {
  HashRouter, Route, Switch,
} from 'react-router-dom'
import Trading from './Pages/Trading'
import Simulator from './Pages/Simulator'
import { rootPath } from './Helper/Helper'

const AppRouter = () => (
  <HashRouter basename={`${rootPath}`}>
    <Switch>
      <Route exact path="/" component={Trading} />
      <Route exact path="/simulator" component={Simulator} />
    </Switch>
  </HashRouter>
)

export default AppRouter
