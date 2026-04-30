import { CognitoJwtVerifier } from 'aws-jwt-verify'

function getIdTokenFromCookieString(cookieString) {
  const match = cookieString.match(/(?:^|;\s*)id_token=([^;]+)/)
  return match ? match[1] : null
}

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: "id",
  clientId: process.env.COGNITO_CLIENT_ID,
})


export const handler = async (event) => {
  const cookieString = event.headers?.cookie ?? event.headers?.Cookie ?? ""
  const idToken = getIdTokenFromCookieString(cookieString)
  console.log("idToken: ", idToken)

  if (idToken == null) {
    console.log("Id token not found in cookies")
    return { statusCode: 401, body: JSON.stringify({ message: "Unauthorized" }) }
  }

  try {
    const payload = await verifier.verify(idToken)
    console.log(payload)
    return {
      statusCode: 200,
      body: JSON.stringify({ user: { email: payload.email } })
    }
  } catch (error) {
    console.error("Token verification failed:", error.message)
    return { statusCode: 401, body: JSON.stringify({ message: "Unauthorized" }) }
  }

}
