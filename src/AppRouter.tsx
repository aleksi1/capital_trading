import {
  BrowserRouter, Route, Switch,
} from 'react-router-dom'
import Trading from './Pages/Trading'
import Simulator from './Pages/Simulator'

const AppRouter = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Trading} />
      <Route exact path="/simulator" component={Simulator} />
    </Switch>
  </BrowserRouter>
)

export default AppRouter
