import qs from 'qs'
import axios from 'axios'

export const handler = async (event) => {
  console.log(event)

  const code = event.queryStringParameters?.code
  if (code == null) {
    return {
      statusCode: 400,
      body: "code query param required",
    }
  }

  const codeVerifier = event.queryStringParameters?.state
  if (codeVerifier == null) {
    return {
      statusCode: 400,
      body: "codeVerifier query param state required",
    }
  }

  const data = {
    grant_type: "authorization_code",
    client_id: process.env.COGNITO_CLIENT_ID,
    redirect_uri: process.env.REDIRECT_URI,
    code: code,
    code_verifier: codeVerifier,
  }

  try {
    const res = await axios.post(
      "https://us-west-2uyfyacv0i.auth.us-west-2.amazoncognito.com/oauth2/token",
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
        Location: [process.env.APP_REDIRECT_LOCATION],
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
