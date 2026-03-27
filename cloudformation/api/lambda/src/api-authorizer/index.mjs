import { CognitoJwtVerifier } from 'aws-jwt-verify'

function getAccessTokenFromCookies(cookiesArray) {
  for (const cookieStr of cookiesArray) {
    const cookieArr = cookieStr.split("accessToken=")
    if (cookieArr[1] != null) {
      return cookieArr[1]
    }
  }
  return null
}

const verifier = CognitoJwtVerifier.create({
  userPoolId: "us-west-2_uyfYAcv0I",
  tokenUse: "access",
  clientId: "55h608590c61vab3bbpmfcjq6d",
})

export const handler = async (event) => {
  if (event.cookies == null) {
    console.log("No cookies found")
    return {
      isAuthorized: false,
    }
  }

  const accessToken = getAccessTokenFromCookies(event.cookies)
  if (accessToken == null) {
    console.log("Access token not found in cookies")
    return {
      isAuthorized: false,
    }
  }

  try {
    await verifier.verify(accessToken)
    return {
      isAuthorized: true,
    }
  } catch (error) {
    console.error(error)
    return {
      isAuthorized: false,
    }
  }
}
