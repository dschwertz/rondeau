import { getAuthStatus } from "@/api/auth/status"
import { logout } from "@/authService"

async function getStatus() {
  try {
    const response = await fetch(`/v0/status`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    console.log(result)
  } catch (err) {
    console.log("error", err)
  }
}

export default function Home() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <button
        className="px-4 py-2 bg-slate-500 text-white rounded-xl"
        type="button"
        onClick={logout}
      >
        Logout
      </button>
      <button
        className="px-4 py-2 bg-slate-500 text-white rounded-xl"
        type="button"
        onClick={getAuthStatus}
      >
        get auth status
      </button>
      <button
        className="px-4 py-2 bg-slate-500 text-white rounded-xl"
        type="button"
        onClick={getStatus}
      >
        get status
      </button>
    </div>
  )
}
