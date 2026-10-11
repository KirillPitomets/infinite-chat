import { getUserListServer } from "@/features/user/api/getUserList.server"
import { ChatUserList } from "./ChatUserList"
import { User } from "@/shared/types/api.type"
import toast from "react-hot-toast"
import { ApiError } from "@/shared/lib/api/unwrap"
import { notFound } from "next/navigation"

export async function ChatUserListServer() {
  let users: User[] = []

  try {
    users = await getUserListServer()
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound()
    }
    throw err
  }

  return <ChatUserList initialData={users} />
}
