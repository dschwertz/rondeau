import express, { type Request, type Response } from 'express'
import { CognitoJwtVerifier } from 'aws-jwt-verify'
import { JwtBaseError } from 'aws-jwt-verify/error'

const authRouter = express.Router({ mergeParams: true })

authRouter.get('/status', async (req: Request, res: Response) => {
  try {
    const userPoolId = process.env.COGNITO_USER_POOL_ID
    if (userPoolId == undefined) throw new Error("Missing User Pool ID.")
    const clientId = process.env.COGNITO_CLIENT_ID
    if (clientId == undefined) throw new Error("Missing Client ID.")
    const idToken = req.cookies.idToken
    if (idToken == undefined) throw new Error("Missing ID Token.")

    const verifier = CognitoJwtVerifier.create({
      userPoolId: userPoolId,
      tokenUse: "id",
      clientId: clientId
    })

    /**
      * @throws JwtBaseError - see https://github.com/awslabs/aws-jwt-verify/blob/main/src/error.ts
      */
    const payload = await verifier.verify(idToken)

    return {
      statusCode: 200,
      body: JSON.stringify({
        isAuthenticated: true,
        user: { email: payload.email },
        message: 'Token successfully verified.',
      }),
    }
  } catch (error: unknown) {
    if (error instanceof JwtBaseError) {
      res.status(500)
      res.send({
        isAuthenticated: false,
        message: 'Authentication failed.'
      })
    } else if (error instanceof Error) {
      res.status(400)
      res.send({
        isAuthenticated: false,
        message: error.message,
      })
    } else {
      res.status(500)
      res.send({
        isAuthenticated: false,
        message: 'An unknown error occured.'
      })
    }
  }
})

authRouter.get('/callback', async (req: Request, res: Response) => {
  try {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',')
    if (allowedOrigins == undefined) throw new Error('Invalid list of allowed origins.')

    const cognitoDomain = process.env.COGNITO_DOMAIN
    if (cognitoDomain == undefined) throw new Error('Missing IDP domain.')

    const clientId = process.env.COGNITO_CLIENT_ID
    if (clientId == undefined) throw new Error('Missing client ID.')

    const code = req.query.code
    if (typeof code !== 'string') throw new Error('Invalid or missing code.')

    const state = req.query.state
    if (typeof state !== 'string') throw new Error('Invalid or missing state.')

    let { verifier, redirectOrigin } = JSON.parse(
      decodeURIComponent(state),
    )

    if (verifier == undefined) throw new Error('Missing verifier.')

    /**
      * @desc A workaround to allow local development. Encoding the full local url is
      *     flagged by the WAF unnecessarily
      */
    if (redirectOrigin == 'localhost') {
      redirectOrigin = 'http://localhost:5173'
    }
    if (redirectOrigin == undefined || !allowedOrigins.includes(redirectOrigin)) {
      throw new Error('Invalid redirect origin.')
    }

    const cognitoResponse = await fetch(
      `${cognitoDomain}/oauth2/token`,
      {
        method: 'POST',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: clientId,
          redirect_uri: `${redirectOrigin}/v0/auth/callback`,
          code: code,
          code_verifier: verifier,
        })
      }
    )

    if (!cognitoResponse.ok) throw new Error('Error fetching id token.')
    const cognitoData = await cognitoResponse.json()
    if (
      cognitoData.access_token == undefined ||
      cognitoData.id_token == undefined ||
      cognitoData.refresh_token == undefined
    ) throw new Error('Invalid tokens returned from IDP.')

    /**
      * @todo Set secure conditionally based on env (prod -> true; dev -> false)
      */
    res.cookie('access_token', cognitoData.access_token, {
      secure: false,
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    })
    res.cookie('id_token', cognitoData.id_token, {
      secure: false,
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    })
    res.cookie('refresh_token', cognitoData.refresh_token, {
      secure: false,
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    })

    res.redirect(302, `${redirectOrigin}/home`)

  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400)
      res.send({
        isAuthenticated: false,
        message: error.message,
      })
    } else {
      res.status(500)
      res.send({
        isAuthenticated: false,
        message: 'An unknown error occured.'
      })
    }
  }
})

/**
  * @todo Expire token in cognito
  */
authRouter.get('/logout', (_, res: Response) => {
  const appBaseUrl = process.env.APP_BASE_URL
  if (appBaseUrl == undefined) throw new Error('Missing client ID.')

  /**
    * @todo Set secure conditionally based on env (prod -> true; dev -> false)
    */
  res.cookie('access_token', "", {
    secure: false,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  })
  res.cookie('id_token', "", {
    secure: false,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  })
  res.cookie('refresh_token', "", {
    secure: false,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  })

  res.redirect(302, appBaseUrl)
})

export default authRouter
