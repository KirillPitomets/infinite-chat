import { auth } from "@clerk/nextjs/server"
import createClient from "openapi-fetch"
import type { paths } from "./schema"

export async function getServerApiClient() {
  const { getToken } = await auth()
  const token = await getToken()

  return createClient<paths>({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    headers: token ? { authorization: `Bearer ${token}` } : undefined
  })
}
