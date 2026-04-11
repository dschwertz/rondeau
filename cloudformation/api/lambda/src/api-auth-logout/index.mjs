export const handler = async (event) => {
  return {
    statusCode: 302,
    multiValueHeaders: {
      Location: [`${process.env.APP_BASE_URL}/login`],
      "Set-Cookie": [
        `accessToken=; Secure; HttpOnly; SameSite=Lax; Path=/; Max-Age=-1`,
        `idToken=; Secure; HttpOnly; SameSite=Lax; Path=/; Max-Age=-1`
      ]
    }
  }
}
