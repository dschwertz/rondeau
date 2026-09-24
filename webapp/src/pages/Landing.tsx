import { useState } from "react"

export default function Landing() {
  const [statusText, setStatusText] = useState("")

  function login() {
    window.location.href = 'https://dev.rondeau.dillonschwertz.dev/v0/login'
  }

  function logout() {
    window.location.href = 'https://dev.rondeau.dillonschwertz.dev/v0/logout'
  }

  async function getStatus() {
    const url = 'https://dev.rondeau.dillonschwertz.dev/v0/status'
    try {
      const response = await fetch(url)
      const text = await response.text()
      setStatusText(`${response.status}:${text}`)
      console.log(response.status, text)
    } catch (error: any) {
      setStatusText(error.message)
      console.log(error.message)
    }
  }

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <div className="flex justify-center items-center">
        <button
          className="px-4 py-2 mx-4 bg-blue-500 text-white rounded-md"
          type="button"
          onClick={login}
        >
          Login
        </button>
        <button
          className="px-4 py-2 mx-4 bg-slate-500 text-white rounded-md"
          type="button"
          onClick={getStatus}
        >
          Status
        </button>
        <button
          className="px-4 py-2 mx-4 bg-red-500 text-white rounded-md"
          type="button"
          onClick={logout}
        >
          Logout
        </button>
      </div>
      <p className="pt-4">{statusText == "" ? "Check status" : statusText}</p>
    </div>
  )
}
