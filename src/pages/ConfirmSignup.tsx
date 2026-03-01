import { useState, type SubmitEvent } from "react"
import { useLocation } from "wouter"
import { confirmSignUp } from "../authService"

export default function ConfirmSignup() {
  const [_, navigate] = useLocation()
  const [email, setEmail] = useState<string>(history.state?.email || "")
  const [confirmationCode, setConfirmationCode] = useState<string>("")

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault()
    try {
      await confirmSignUp(email, confirmationCode)
      alert("Account confirmed successfully!\nSign in on next page.")
      navigate("/")
    } catch (error) {
      alert(`Failed to confirm account: ${error}`)
    }
  }

  return (
    <div className='w-screen h-screen flex flex-col justify-center items-center'>
      <p className="text-lg">
        Confirm your new account
      </p>
      <form
        className="mt-8 flex flex-col"
        onSubmit={handleSubmit}
      >
        <div>
          <input
            className="px-4 py-2 w-96 border-2 border-slate-500 rounded-lg"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
        <div>
          <input
            className="mt-2 px-4 py-2 w-96 border-2 border-slate-500 rounded-lg"
            type="text"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            placeholder="Confirmation Code"
            required
          />
        </div>
        <button
          className='mt-8 px-4 py-2 bg-blue-500 text-white rounded-xl'
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  )
}
