export async function login() {
  async function generatePKCE() {
    const verifier =
      crypto.randomUUID().replace(/-/g, "") +
      crypto.randomUUID().replace(/-/g, "")
    const challenge = btoa(
      String.fromCharCode(
        ...new Uint8Array(
          await crypto.subtle.digest(
            "SHA-256",
            new TextEncoder().encode(verifier),
          ),
        ),
      ),
    )
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "")
    return { verifier, challenge }
  }

  const { verifier, challenge } = await generatePKCE()
  const state = encodeURIComponent(
    JSON.stringify({
      verifier,
      redirectOrigin:
        import.meta.env.MODE == "dev" ? "localhost" : window.location.origin,
    }),
  )

  // https://docs.aws.amazon.com/cognito/latest/developerguide/authorization-endpoint.html#sample-authorization-code-grant-with-pkce
  window.location.href =
    `${import.meta.env.VITE_COGNITO_DOMAIN}/oauth2/authorize?` +
    new URLSearchParams({
      response_type: "code",
      client_id: import.meta.env.VITE_COGNITO_CLIENT_ID,
      redirect_uri: import.meta.env.VITE_COGNITO_REDIRECT_URI,
      state: state,
      scope: "email openid profile",
      code_challenge_method: "S256",
      code_challenge: challenge,
    })
}

export function logout() {
  window.location.href =
    `${import.meta.env.VITE_COGNITO_DOMAIN}/logout?` +
    new URLSearchParams({
      client_id: import.meta.env.VITE_COGNITO_CLIENT_ID,
      logout_uri: import.meta.env.VITE_COGNITO_LOGOUT_URI,
    })
}
