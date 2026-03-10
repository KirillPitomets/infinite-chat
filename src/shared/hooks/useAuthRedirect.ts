"use client"

import {ACСOOUNT_PAGES} from "@/shared/config/accountPages.config"
import {useUser} from "@clerk/nextjs"
import {useRouter} from "next/navigation"
import {useEffect} from "react"

export const useAuthRedirect = () => {
  const {user, isSignedIn} = useUser()
  const {push} = useRouter()

  useEffect(() => {
    if (user && isSignedIn) push(ACСOOUNT_PAGES.HOME)
  }, [user, isSignedIn, push])
}
