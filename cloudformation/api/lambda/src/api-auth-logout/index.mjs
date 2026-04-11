import { SSMClient, GetParametersByPathCommand } from "@aws-sdk/client-ssm"

const ssm = new SSMClient({})
let config

const getConfig = async () => {
  if (config) return config

  const response = await ssm.send(new GetParametersByPathCommand({
    Path: "/",
    WithDecryption: true
  }))

  config = Object.fromEntries(
    response.Parameters.map(p => [p.Name.split("/").pop(), p.Value])
  )

  return config
}

export const handler = async (event) => {
  const { appBaseUrl } = await getConfig()

  return {
    statusCode: 302,
    multiValueHeaders: {
      Location: [`${appBaseUrl}/login`],
      "Set-Cookie": [
        `accessToken=; Secure; HttpOnly; SameSite=Lax; Path=/; Max-Age=-1`,
        `idToken=; Secure; HttpOnly; SameSite=Lax; Path=/; Max-Age=-1`
      ]
    }
  }
}
