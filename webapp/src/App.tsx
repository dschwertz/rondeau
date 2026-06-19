import { useEffect, useState } from "react"
import { Redirect, Route, Switch } from "wouter"

import { getAuthStatus } from "@/api/auth/status"
import type { AuthStatus } from "@/types"

import Root from "@/pages/Root"
import Home from "@/pages/Home"

function App() {
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        setAuthStatus(await getAuthStatus())
      } catch (err) {
        setAuthStatus({
          isAuthenticated: false,
          message: "Client fetch error.",
        })
      }
    })()
  }, [])

  if (authStatus == null) {
    return null
  } else if (authStatus.isAuthenticated == false) {
    return (
      <>
        <Switch>
          <Route path="/" component={Root} />
          <Redirect to="/" />
        </Switch>
      </>
    )
  } else if (authStatus.isAuthenticated == true) {
    return (
      <>
        <Switch>
          <Route path="/home" component={Home} />
          <Redirect to="/home" />
        </Switch>
      </>
    )
  }
}

export default App
