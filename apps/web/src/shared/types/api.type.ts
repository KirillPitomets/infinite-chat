import { components, paths } from "@/shared/lib/api/schema"

export type User = components["schemas"]["UserEntity"]
export type Room = components["schemas"]["RoomEntity"]
// export type Message = components["schemas"]["message"]

export type UserListResponse =
  paths["/api/v1/user"]["get"]["responses"]["200"]["content"]["application/json"]
