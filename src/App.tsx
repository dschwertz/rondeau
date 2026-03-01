import { Route, Switch } from 'wouter'
import Home from './pages/Home'
import LogIn from './pages/LogIn'
import ConfirmSignup from './pages/ConfirmSignup'

export default function App() {
  return (
    <>
      <Switch>
        <Route path='/' component={LogIn} />
        <Route path='/home' component={Home} />
        <Route path='/confirm-signup' component={ConfirmSignup} />

        <Route>404</Route>
      </Switch>
    </>
  )
}
