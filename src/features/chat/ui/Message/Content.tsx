import { ChatUIMessage, UIAttachment } from "../../message/model/message.types"
import { Attachments } from "./Attachments"

type MessageContentProps = {
  messageStatus: ChatUIMessage["status"]
  attachments: UIAttachment[]
  content: string
  onPreviewImage: ({ url, alt }: { url: string; alt: string }) => void
}

export const MessageContent = ({
  messageStatus,
  attachments,
  content,
  onPreviewImage
}: MessageContentProps) => {
  return (
    <div className="relative flex flex-wrap items-end gap-4 rounded-2xl">
      <div className="space-y-3">
        {attachments.length > 0 && (
          <Attachments
            isLoading={messageStatus === "loading" ? true : false}
            attachments={attachments}
            openDialog={(url: string, alt: string) =>
              onPreviewImage({ url, alt })
            }
          />
        )}
        <p className="text-zinc-800">{content}</p>
      </div>
    </div>
  )
}
