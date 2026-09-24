import express, { type Express, type Response } from 'express'

const app: Express = express()
const port = 3000
const versionId = 'v0'

app.set('query parser', 'extended')

// Used by load balancer target group to determine instance health.
// Not routed by load balancer and thus is unreachable except from load balancer.
app.get('/health', (_, res: Response) => {
  res.status(200).send('Healthy')
})

// This route '/version/login' is the only route configured by the load balancer
// to redirect an unauthenticated request to the idp. Every other request must
// include the authentication or it will not be routed past the load balancer.
app.get(`/${versionId}/login`, (_, res: Response) => {
  res.status(200).send('Login Successful.')
})

app.get(`/${versionId}/status`, (_, res: Response) => {
  res.status(200).send('Ok.')
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
