import Linkify from "linkify-react"
import { ChatUIMessage, UIAttachment } from "../../message/model/message.types"
import { Attachments } from "./Attachments"

type MessageContentProps = {
  messageStatus: ChatUIMessage["status"]
  attachments: UIAttachment[]
  content?: string | null | undefined
  onPreviewImage: ({ url, alt }: { url: string; alt: string }) => void
}

export const MessageContent = ({
  messageStatus,
  attachments,
  content,
  onPreviewImage
}: MessageContentProps) => {
  return (
    <div className="relative flex flex-wrap items-end gap-4">
      <div className="space-y-2">
        {attachments.length > 0 && (
          <Attachments
            isLoading={messageStatus === "loading" ? true : false}
            attachments={attachments}
            openDialog={(url: string, alt: string) =>
              onPreviewImage({ url, alt })
            }
          />
        )}
        <p
          style={{ wordBreak: "break-word" }}
          className="whitespace-pre-wrap leading-relaxed"
        >
          <Linkify
            options={{
              target: "_blank",
              rel: "noopener noreference",
              className: "text-blue-500 break-all hover:underline"
            }}
          >
            {content}
          </Linkify>
        </p>
      </div>
    </div>
  )
}
