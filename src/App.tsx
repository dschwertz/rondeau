import { Route, Switch } from 'wouter'
import Home from './pages/Home'
import LogIn from './pages/LogIn'
import ConfirmSignup from './pages/ConfirmSignup'

function App() {
  return (
    <>
      <Switch>
        <Route path='/login' component={LogIn} />
        <Route path='/home' component={Home} />
        <Route path='/confirm-signup' component={ConfirmSignup} />

        <Route>404</Route>
      </Switch>
    </>
  )
}

export default App
