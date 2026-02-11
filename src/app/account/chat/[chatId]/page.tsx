"use client"

import {Header} from "./components/Header/Header"
import {MessageList} from "./components/MessageList"

export default function Page() {
  return (
    <div className="flex flex-col flex-1 w-full justify-beetwen">
      <Header />
      <MessageList />
    </div>
  )
}
