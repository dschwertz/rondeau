import { login } from "../authService"

export default function LogIn() {
  return (
    <div className='w-screen h-screen flex flex-col justify-center items-center'>
      <p className="text-4xl">
        Welcome
      </p>
      <button
        className='mt-8 px-4 py-2 bg-blue-500 text-white rounded-xl'
        onClick={login}
      >
        Sign in or create an account
      </button>
    </div>
  )
}
