"use client"

import {ACCOUNT_PAGES} from "@/shared/config/accountPages.config"
import {useUser} from "@clerk/nextjs"
import {useRouter} from "next/navigation"
import {useEffect} from "react"

export const useAuthRedirect = () => {
  const {user, isSignedIn} = useUser()
  const {push} = useRouter()

  useEffect(() => {
    if (user && isSignedIn) push(ACCOUNT_PAGES.HOME)
  }, [user, isSignedIn, push])
}
