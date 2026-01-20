"use client"

import {useAuthRedirect} from "@/hooks/useAuthRedirect"

export default function Home() {
  useAuthRedirect()

  return (
    <>
      <h1>Welcome to Infinite chat 😊❤️</h1>
    </>
  )
}
