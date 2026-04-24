import { CognitoJwtVerifier } from 'aws-jwt-verify'

function getAccessTokenFromCookieString(cookieString) {
  const match = cookieString.match(/(?:^|;\s*)access_token=([^;]+)/)
  return match ? match[1] : null
}

function makePolicy(principalId, effect, resource) {
  return {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [{ Action: "execute-api:Invoke", Effect: effect, Resource: resource }]
    }
  }
}

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: "access",
  clientId: process.env.COGNITO_CLIENT_ID,
})

// event schema for token type authorization lambda:
// {
// type: 'TOKEN',
// methodArn: 'arn::123',
// authorizationToken: 'access_token=123'
// }
export const handler = async (event) => {
  const deny = () => makePolicy("denied", "Deny", event.methodArn)

  if (event.authorizationToken == null) {
    console.error("No cookies found")
    return deny()
  }

  const accessToken = getAccessTokenFromCookieString(event.authorizationToken)
  console.log("accessToken: ", accessToken)
  if (accessToken == null) {
    console.log("Access token not found in cookies")
    return deny()
  }

  try {
    const payload = await verifier.verify(accessToken)
    return makePolicy(payload.sub, "Allow", event.methodArn)
  } catch (error) {
    console.error("Token verification failed:", error.message)
    return deny()
  }
}

