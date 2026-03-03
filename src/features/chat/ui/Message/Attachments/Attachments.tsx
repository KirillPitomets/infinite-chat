import { UIAttachment } from "@/features/chat/message/model/message.types"
import Image from "next/image"
import { AttachmentsSkeleton } from "./AttachmentsSkeleton"

type AttachmentsProps = {
  isLoading?: boolean
  attachments: UIAttachment[]
  openDialog: (url: string, alt: string) => void
}

export const Attachments = ({
  isLoading = false,
  attachments,
  openDialog
}: AttachmentsProps) => {
  if (isLoading) {
    return <AttachmentsSkeleton count={attachments.length} />
  }

  return (
    <div className="flex items-end gap-1">
      {attachments.map(file => (
        <div
          className="flex justify-center items-center rounded-2xl"
          key={file.key}
        >
          {file.isError ? (
            <div className="bg-red-400 text-white p-2 w-full text-center font-semibold">
              Failed to load :(
            </div>
          ) : (
            <Image
              width={200}
              height={200}
              className="w-full object-contain border-2 border-transparent cursor-pointer hover:border-green-400"
              onClick={() => openDialog(file.url, file.name)}
              src={file.url ? file.url : "/"}
              alt={file.name}
            />
          )}
        </div>
      ))}
    </div>
  )
}
