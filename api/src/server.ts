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
  res.redirect('/')
})

// Clears any tokens before forwarding to cognito to complete logout flow.
app.get(`/${versionId}/logout`, (_, res: Response) => {
  const cookieNames = [
    'AWSELBAuthSessionCookie-0',
    'AWSELBAuthSessionCookie-1',
    'AWSELBAuthSessionCookie-2',
    'AWSELBAuthSessionCookie-3',
  ]
  cookieNames.forEach(name => {
    res.clearCookie(name, { path: '/', secure: true, httpOnly: true })
  })

  const cognitoDomain = process.env.COGNITO_DOMAIN
  const clientId = process.env.COGNITO_CLIENT_ID
  const logoutUri = process.env.LOGOUT_URI || ""

  res.redirect(
    `https://${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`
  )
})

app.get(`/${versionId}/status`, (_, res: Response) => {
  res.status(200).send('Ok.')
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
