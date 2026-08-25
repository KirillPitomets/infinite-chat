import { getUserListServer } from "@/features/user/api/getUserList.server"
import { ChatUserList } from "./ChatUserList"

export async function ChatUserListServer() {
  const users = await getUserListServer()

  return <ChatUserList initialData={users} />
}
