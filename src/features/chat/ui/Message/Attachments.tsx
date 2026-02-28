import Loader from "@/shared/components/ui/Loader"
import { MessageAttachment } from "@/shared/schemes/message.schema"
import Image from "next/image"

type AttachmentsProps = {
  attachments: MessageAttachment[]
  openDialog: (url: string, name: string) => void
}

export const Attachments = ({ attachments, openDialog }: AttachmentsProps) => {
  return (
    <div>
      {attachments.map((file, indx) =>
        file.url ? (
          <Image
            width={200}
            height={200}
            className="max-w-[200px] contain-content border-2 cursor-pointer hover:border-green-400"
            onClick={() => openDialog(file.url, file.name)}
            key={`msg-preview-img-${indx}-${file}`}
            src={file.url}
            alt={file.name}
          />
        ) : (
          <div
            className="w-[200px] h-[200px] flex justify-center items-center rounded-2xl bg-zinc-400"
            key={`msg-preview-img-${indx}-${file}`}
          >
            <div className="flex items-center justify-center gap-4 animate-pulse">
              <Loader />
              <p className="font-semibold ">Loading</p>
            </div>
          </div>
        )
      )}
    </div>
  )
}
