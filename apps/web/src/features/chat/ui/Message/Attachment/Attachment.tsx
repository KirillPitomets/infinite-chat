import { UIAttachment } from "@/features/chat/message/model/message.types"
import Image from "next/image"
import { AttachmentsSkeleton } from "./AttachmentsSkeleton"

type AttachmentsProps = {
  att: UIAttachment
  openDialog: (url: string, alt: string) => void
}

export const Attachment = ({ att, openDialog }: AttachmentsProps) => {
  return (
    <div className="flex justify-center items-center rounded-2xl" key={att.key}>
      {att.isError ? (
        <div>Failed to load</div>
      ) : (
        att.type === "IMAGE" &&
        att.url && (
          <Image
            width={200}
            height={200}
            className="w-full object-contain border-2 border-transparent cursor-pointer hover:border-green-400"
            onClick={() => openDialog(att.url, att.name)}
            src={att.url}
            alt={att.name}
          />
        )
      )}
    </div>
  )
}
