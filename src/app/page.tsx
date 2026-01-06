"use client"

import {ACOOUNT_PAGES} from "@/config/accountPages.config"
import {AUTH_PAGES} from "@/config/authPages.config"
import {useUser} from "@/hooks/useUser"
import Link from "next/link"
import {redirect} from "next/navigation"

export default function Home() {
  const {user} = useUser()

  if (user) {
    redirect(ACOOUNT_PAGES.CHAT)
  }

  return (
    <div className="flex flex-col gap-2 min-h-screen items-center justify-center bg-gray-900">
      <h1 className="mb-4 text-4xl font-bold">Not logged in</h1>
      <div className="flex item-center gap-2">
        <Link
          href={AUTH_PAGES.SIGN_UP}
          className="inline-flex text-lg text-indigo-400 hover:underline"
        >
          Sign-up
        </Link>
        <Link
          href={AUTH_PAGES.SIGN_IN}
          className="inline-flex text-lg text-indigo-400 hover:underline"
        >
          Sign-in
        </Link>
      </div>
    </div>
  )
}
