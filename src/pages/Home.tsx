import { useLocation } from "wouter"

function parseJwt(token: string) {
  const base64Url = token.split(".")[1]
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
      .join(""),
  )
  return JSON.parse(jsonPayload)
}

export default function Home() {
  const [_, navigate] = useLocation()
  const idToken = parseJwt(sessionStorage.idToken.toString())
  const accessToken = parseJwt(sessionStorage.accessToken.toString())
  console.log(
    `Amazon Cognito ID token encoded: ${sessionStorage.idToken.toString()}`,
  )
  console.log("Amazon Cognito ID token decoded: ")
  console.log(idToken)
  console.log(
    `Amazon Cognito access token encoded: ${sessionStorage.accessToken.toString()}`,
  )
  console.log("Amazon Cognito access token decoded: ")
  console.log(accessToken)
  console.log("Amazon Cognito refresh token: ")
  console.log(sessionStorage.refreshToken)

  function handleLogout() {
    sessionStorage.clear()
    navigate("/")
  }

  return (
    <div className='w-screen h-screen flex justify-center items-center'>
      <button
        className='px-4 py-2 bg-slate-500 text-white rounded-xl'
        type="button"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  )
}
