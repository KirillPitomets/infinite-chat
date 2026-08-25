import { useAuth } from "@clerk/nextjs"
import createClient from "openapi-fetch"
import { useMemo } from "react"
import { paths } from "./schema"

export function useApiClient() {
  const { getToken } = useAuth()

  const client = useMemo(() => {
    const c = createClient<paths>({ baseUrl: process.env.NEXT_PUBLIC_API_URL })

    c.use({
      async onRequest({ request }) {
        const token = await getToken()
        if (token) request.headers.set("Authorization", `Bearer ${token}`)
        return request
      }
    })

    return c
  }, [getToken])

  return client
}
