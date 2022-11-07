import { Provider } from 'react-redux'
import store from './store'
import AppRouter from './AppRouter'
import Theme from './Components/Theme'
import './i18n'

const App = () => (
  <Provider store={store}>
    <div className="App">
      <Theme>
        <AppRouter />
      </Theme>
    </div>
  </Provider>
)

export default App
