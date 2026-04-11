import { Redirect, Route, Switch } from 'wouter'
import Home from './pages/Home'
import LogIn from './pages/LogIn'

function App() {
  return (
    <>
      <Switch>
        <Route path='/login' component={LogIn} />
        <Route path='/' component={Home} />

        <Redirect to='/login' />
      </Switch>
    </>
  )
}

export default App
