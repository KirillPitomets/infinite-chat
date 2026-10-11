"use client"
import { Button } from "@/shared/components/ui/Button"
import { SignOutButton } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="w-full min-h-screen flex items-center justify-center flex-col gap-5">
      <div className="space-y-3">
        <h1 className="text-5xl font-bold ">Oops!</h1>
        <p className="text-3xl">Something went wrong 🥲</p>
      </div>

      <div className="font-semibold text-xl gap-3 text-center">
        <p className="text-7xl font-bold text-green-600">404</p>
        <p className="text-2xl first-letter:uppercase">page not found</p>
      </div>
      <div className="flex items-center justify-center gap-5">
        <Button
          tone="fill"
          onClick={() => {
            router.push("/")
          }}
        >
          Back to home
        </Button>
        <SignOutButton>
          <Button tone="fill-danger">Logout</Button>
        </SignOutButton>
      </div>
    </div>
  )
}
