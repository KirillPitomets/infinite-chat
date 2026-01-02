import type { PropsWithChildren } from "react"
import { InboxMessages } from "./InboxMessages"

export default function Layout({children}: PropsWithChildren<unknown>) {
  return (
    <div className="w-full flex">
      <InboxMessages />
      {children}
    </div>
  )
}
