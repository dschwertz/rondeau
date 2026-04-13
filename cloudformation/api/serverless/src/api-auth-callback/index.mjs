import qs from 'qs'
import axios from 'axios'

export const handler = async (event) => {
  const code = event.queryStringParameters?.code
  if (code == null) {
    return {
      statusCode: 400,
      body: "code query param required",
    }
  }

  const { codeVerifier, redirectOrigin } = JSON.parse(decodeURIComponent(event.queryStringParameters?.state))

  const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',')
  if (!allowedOrigins.includes(redirectOrigin)) {
    return {
      statusCode: 400,
      body: 'Invalid redirect origin'
    }
  }


  if (codeVerifier == null) {
    return {
      statusCode: 400,
      body: "codeVerifier query param state required",
    }
  }

  const data = {
    grant_type: "authorization_code",
    client_id: process.env.COGNITO_CLIENT_ID,
    redirect_uri: `${redirectOrigin}/v0/auth/callback`,
    code: code,
    code_verifier: codeVerifier,
  }

  try {
    const res = await axios.post(
      `${process.env.COGNITO_DOMAIN}/oauth2/token`,
      qs.stringify(data),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )

    console.log("Token exchange successful: ", res.data)

    return {
      statusCode: 302,
      multiValueHeaders: {
        Location: [redirectOrigin],
        "Set-Cookie": [
          `access_token=${res.data.access_token}; Secure; HttpOnly; SameSite=Lax; Path=/`,
          `id_token=${res.data.id_token}; Secure; HttpOnly; SameSite=Lax; Path=/`,
          `refresh_token=${res.data.refresh_token}; Secure; HttpOnly; SameSite=Lax; Path=/`
        ]
      }
    }
  } catch (error) {
    console.error("Token exchange failed: ", error.response?.data || error.message)

    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.response?.data || error.message })
    }
  }
}
