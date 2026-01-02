import {ChatHeader} from "./ChatHeader"
import {ChatMessageInput} from "./ChatMessageInput"

export default function Page() {
  return (
    <div className="w-full flex-1 flex flex-col justify-beetwen">
      <ChatHeader />

      <div className="flex-1">Messages</div>

      <ChatMessageInput />
    </div>
  )
}
