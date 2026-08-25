import { getServerApiClient } from "@/shared/lib/api/getServerApiClient"
import { unwrap } from "@/shared/lib/api/unwrap"
import { User } from "@/shared/types/api.type"

export async function getUserListServer(): Promise<User[]> {
  const api = await getServerApiClient()
  return await unwrap(api.GET("/api/v1/user"))
}
