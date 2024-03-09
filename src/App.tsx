import { RecoilRoot } from 'recoil'
import AppRouter from './AppRouter'
import Theme from './Components/Theme'
import './i18n'

const App = () => (
  <RecoilRoot>
    <div className="App">
      <Theme>
        <AppRouter />
      </Theme>
    </div>
  </RecoilRoot>
)

export default App
