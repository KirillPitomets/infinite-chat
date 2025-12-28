import SearchInput from "@/components/SearchInput/SearchInput"
import ChatItem from "./ChatItem"
import {chats} from "../../../data/chats.data"

export function InboxMessages() {
  return (
    <div className="py-7.5 h-screen flex flex-col border-r border-zinc-300">
      <div className="px-5 mb-5">
        <h2 className="text-xl font-bold mb-2">Messages</h2>
        <SearchInput />
      </div>

      <div className="overflow-y-auto scroll-bar-thin">
        {chats.map(chat => (
          <ChatItem key={chat.id} {...chat} />
        ))}
      </div>
    </div>
  )
}
