"use client"
import { parseErrorMessage } from "@/shared/utils/parseErrorStatus"
import { useRouter } from "next/navigation"

export default function Error({
  error,
  reset
}: {
  error: Error
  reset: () => void
}) {
  const { status, text } = parseErrorMessage(error.message)
  const router = useRouter()
  return (
    <div className="w-full min-h-screen flex items-center justify-center flex-col gap-5">
      <div className="space-y-3">
        <h1 className="text-5xl font-bold ">Oops!</h1>
        <p className="text-3xl">Something went wrong 🥲</p>
      </div>
      {status && text && (
        <div className="font-semibold text-xl gap-3 text-center">
          <p className="text-7xl font-bold text-green-600">{status}</p>
          <p className="text-2xl first-letter:uppercase">{text}</p>
        </div>
      )}
      <div className="flex items-center justify-center gap-5">
        <button
          className="bg-green-600 rounded-sm px-4 py-2 cursor-pointer transition-all hover:bg-green-900 "
          onClick={() => {
            router.push("/")
          }}
        >
          Back to home
        </button>
        <button
          className="bg-green-600 rounded-sm px-4 py-2 cursor-pointer transition-all hover:bg-green-900 "
          onClick={() => {
            window.location.reload()
          }}
        >
          Try again
        </button>
      </div>
    </div>
  )
}
