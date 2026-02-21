"use client"

import {ACOOUNT_PAGES} from "@/shared/config/accountPages.config"
import {useUser} from "@clerk/nextjs"
import {useRouter} from "next/navigation"
import {useEffect} from "react"

export const useAuthRedirect = () => {
  const {user, isSignedIn} = useUser()
  const {push} = useRouter()

  useEffect(() => {
    if (user && isSignedIn) push(ACOOUNT_PAGES.HOME)
  }, [user, isSignedIn, push])
}
