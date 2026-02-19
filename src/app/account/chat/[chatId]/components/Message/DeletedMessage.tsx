import Image from "next/image"
import React from "react"

type DeletedMessageProps = {
  isMine: boolean
  senderName: string
  senderImageUrl: string
}

const DeletedMessage = ({
  isMine,
  senderImageUrl,
  senderName
}: DeletedMessageProps) => {
  return (
    <div className={`w-full flex ${isMine && "justify-end"} break-all`}>
      <div className="flex flex-col space-y-2">
        {!isMine && (
          <div className="flex space-x-2.5">
            <div className="w-6.25 h-6.25">
              <Image
                width={25}
                height={25}
                src={senderImageUrl}
                alt={senderName}
                className="rounded-2xl"
              />
            </div>
            <p>{senderName}</p>
          </div>
        )}
        <div className="p-4 rounded-2xl bg-zinc-100">
          <p className="text-zinc-800">Message had deleted</p>
        </div>
      </div>
    </div>
  )
}

export default DeletedMessage
