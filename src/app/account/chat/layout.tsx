import type { PropsWithChildren } from "react"
import { InboxMessages } from "./components/InboxMessages/InboxMessages"

export default function Layout({children}: PropsWithChildren<unknown>) {
  return (
    <div className="w-full flex">
      <InboxMessages />
      {children}
    </div>
  )
}
