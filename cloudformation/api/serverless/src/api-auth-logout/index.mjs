export const handler = async (event) => {
  return {
    statusCode: 302,
    multiValueHeaders: {
      Location: [`${process.env.APP_BASE_URL}/login`],
      "Set-Cookie": [
        `access_token=; Secure; HttpOnly; SameSite=Lax; Path=/; Max-Age=-1`,
        `id_token=; Secure; HttpOnly; SameSite=Lax; Path=/; Max-Age=-1`
      ]
    }
  }
}
