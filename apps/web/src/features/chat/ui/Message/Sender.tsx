import Image from "next/image"
import React from "react"

type MessageSenderProps = {
  avatarUrl: string
  name: string
}

export const MessageSender = ({ avatarUrl, name }: MessageSenderProps) => {
  return (
    <div className="flex space-x-2.5">
      <Image
        width={25}
        height={25}
        src={avatarUrl}
        alt={name}
        className="rounded-2xl"
      />
      <p>{name}</p>
    </div>
  )
}
