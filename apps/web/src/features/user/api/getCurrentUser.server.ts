import { getServerApiClient } from "@/shared/lib/api/getServerApiClient"
import { paths, components } from "@/shared/lib/api/schema"
import { unwrap } from "@/shared/lib/api/unwrap"

type User = components["schemas"]["UserEntity"]

export async function getCurrentUserServer(): Promise<User> {
  const api = await getServerApiClient()
  return await unwrap(api.GET("/api/v1/user/me"))
}
