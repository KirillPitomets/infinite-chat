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
    <div className="space-y-2">
      {attachments.map((file, indx) => (
        <div
          className="max-w-[900px] flex justify-center items-center rounded-2xl"
          key={`${file.key}-${indx}`}
        >
          {file.isError ? (
            <div className="bg-red-400 text-white p-2 w-full text-center font-semibold">
              Failde to load :(
            </div>
          ) : (
            <Image
              width={200}
              height={200}
              className="max-w-[200px] object-content border-2 cursor-pointer hover:border-green-400"
              onClick={() => openDialog(file.url, file.name)}
              key={`${file.key}-${indx}`}
              src={file.url ? file.url : "/"}
              alt={file.name}
            />
          )}
        </div>
      ))}
    </div>
  )
}
