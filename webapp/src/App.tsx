import { Redirect, Route, Switch } from "wouter"

import Landing from "@/pages/Landing"

function App() {
  return (
    <>
      <Switch>
        <Route path="/" component={Landing} />
        <Redirect to="/" />
      </Switch>
    </>
  )
}

export default App
