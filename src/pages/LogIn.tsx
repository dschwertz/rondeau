import { useState } from "react"
import { useLocation } from "wouter"
import { signIn, signUp } from "../authService"

export default function LogIn() {
  const [_, navigate] = useLocation()

  const [isSignUp, setIsSignUp] = useState<boolean>(false)
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")

  async function handleSignIn(e: { preventDefault: () => void }) {
    e.preventDefault()
    try {
      const session = await signIn(email, password)
      console.log("Sign in resulting session: ", session)
      if (session && typeof session.AccessToken !== "undefined") {
        sessionStorage.setItem("accessToken", session.AccessToken)
        if (sessionStorage.getItem("accessToken")) {
          navigate("/home")
        } else {
          console.error("Session token was not set properly.")
        }
      } else {
        console.error("SignIn session or AccessToken is undefined.")
      }
    } catch (error) {
      alert(`Sign in failed: ${error}`)
    }
  }

  async function handleSignUp(e: { preventDefault: () => void }) {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }
    try {
      await signUp(email, password)
      navigate("/confirm-signup", { state: { email } })
    } catch (error) {
      alert(`Sign up failed: ${error}`)
    }
  }

  return (
    <div className='w-screen h-screen flex flex-col justify-center items-center'>
      <p className="text-4xl">
        Welcome
      </p>
      <p className="">
        {isSignUp ? "Sign up to create an account" : "Sign in to your account"}
      </p>
      <form
        className="mt-8 flex flex-col"
        onSubmit={isSignUp ? handleSignUp : handleSignIn}
      >
        <div className="">
          <input
            className="px-4 py-2 w-96 border-2 border-slate-500 rounded-lg"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
        <div className="">
          <input
            className="mt-2 px-4 py-2 w-96 border-2 border-slate-500 rounded-lg"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        {isSignUp && (
          <div>
            <input
              className="mt-2 px-4 py-2 w-96 border-2 border-slate-500 rounded-lg"
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
            />
          </div>
        )}
        <button
          className='mt-8 px-4 py-2 bg-blue-500 text-white rounded-xl'
          type="submit"
        >
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>
        <button
          className='mt-4 px-4 py-2 bg-slate-500 text-white rounded-xl'
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
        </button>
      </form>
    </div>
  )
}
