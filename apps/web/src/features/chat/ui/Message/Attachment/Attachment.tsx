import { UIAttachment } from "@/features/chat/message/model/message.types"
import Image from "next/image"
import { AttachmentsSkeleton } from "./AttachmentsSkeleton"
import { useState } from "react"
import { VideoAttachment } from "./VideoAttachment"
import { FileAttachment } from "./FileAttachment"

type AttachmentsProps = {
  att: UIAttachment
  openDialog: (url: string, alt: string) => void
}

export const Attachment = ({ att, openDialog }: AttachmentsProps) => {
  switch (att.type) {
    case "VIDEO":
      return <VideoAttachment url={att.url} name={att.name} />
    case "IMAGE":
      return (
        <div className="flex justify-center items-center rounded-2xl">
          <img
            width={200}
            height={200}
            src={att.url}
            alt={att.name}
            className="w-full object-contain border-2 border-transparent cursor-pointer hover:border-green-400"
            onClick={() => openDialog(att.url, att.name)}
          />
        </div>
      )
    case "FILE":
      return <FileAttachment name={att.name} size={att.size} url={att.url} />
  }
}
