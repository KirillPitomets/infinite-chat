"use client"
import {useEffect, useState} from "react"
import {edenClient} from "@/lib/eden"
import type {User} from "@/prisma/generated/client"

export function useUser() {
  const [user, setUser] = useState<User | null>()
  const [loading, setLoading] = useState<boolean>(false)
  const [err, setErr] = useState<Error | null>()

  useEffect(() => {
    let isMounted = true

    const loadUser = async () => {
      try {
        setLoading(true)

        const res = await edenClient.user.sync.get()
        if (!isMounted) return

        setUser(res.data)
      } catch (err) {
        if (!isMounted) return
        setErr(err as Error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadUser()

    return () => {
      isMounted = false
    }
  }, [])

  return {
    user,
    loading,
    err
  }
}
