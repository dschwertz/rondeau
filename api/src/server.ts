import express, { type Express, type Response } from 'express'
import cookieParser from 'cookie-parser'
import swaggerUi from 'swagger-ui-express'
import * as swaggerDocument from './swagger.json' with { type: 'json' }

const app: Express = express()
const port = 3000
const versionId = 'v0'

app.set('query parser', 'extended')

app.use(cookieParser())

app.use(`/${versionId}/api`, swaggerUi.serve, swaggerUi.setup(swaggerDocument.default))

app.get(`/${versionId}/`, (_, res: Response) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
