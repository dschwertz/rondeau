import { logout } from "../authService";

export default function Home() {
  return (
    <div className='w-screen h-screen flex justify-center items-center'>
      <button
        className='px-4 py-2 bg-slate-500 text-white rounded-xl'
        type="button"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  )
}
