"use client"

import {useAuthRedirect} from "@/hooks/useAuthRedirect"
import {SignInButton, SignUpButton} from "@clerk/nextjs"

export default function Home() {
  useAuthRedirect()

  return (
    <main className="flex justify-center items-center flex-col w-full h-screen">
      <h1>Welcome to Infinite chat 😊❤️</h1>

      {
        <div className="space-x-4">
          <SignInButton>
            <button className="border border-zinc-400 p-2 rounded-2xl transition-colors cursor-pointer hover:bg-zinc-700 hover:text-white">
              Sign in
            </button>
          </SignInButton>
          <SignUpButton>
            <button className="border border-zinc-400 p-2 rounded-2xl transition-colors cursor-pointer hover:bg-zinc-700 hover:text-white">
              Sign Up
            </button>
          </SignUpButton>
        </div>
      }
    </main>
  )
}
