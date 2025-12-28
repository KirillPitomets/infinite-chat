import { ChatHeader } from "./ChatHeader"

export default function Page() {
  return (
    <div className="w-full flex-1 flex flex-col justify-beetwen">
      <ChatHeader/>

      <div className="flex-1">Messages</div>

      <label>
        <input type="text" placeholder="message..." />
        <button>Send message</button>
      </label>
    </div>
  )
}
