import { getUserListServer } from "@/features/user/api/getUserList.server"
import { ChatUserList } from "./ChatUserList"
import { User } from "@/shared/types/api.type"
import toast from "react-hot-toast"
import { ApiError } from "@/shared/lib/api/unwrap"

export async function ChatUserListServer() {
  let users: User[] = []

  try {
    users = await getUserListServer()
  } catch (err) {
    if (err instanceof ApiError) {
      toast.error(err.message)
    } else {
      toast.error((err as Error).message)
    }
  }

  return <ChatUserList initialData={users} />
}
