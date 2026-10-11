import Linkify from "linkify-react"
import { ChatUIMessage, UIAttachment } from "../../message/model/message.types"
import { Attachment } from "./Attachment"
import { AttachmentsSkeleton } from "./Attachment/AttachmentsSkeleton"

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
      <div>
        <div className="flex flex-wrap items-start gap-1">
          {attachments.length > 0 && messageStatus === "loading" ? (
            <AttachmentsSkeleton count={attachments.length || 3} />
          ) : (
            attachments.map(att => (
              <Attachment
                key={att.key}
                att={att}
                openDialog={(url, alt) => onPreviewImage({ url, alt })}
              />
            ))
          )}
        </div>

        <p
          style={{ wordBreak: "break-word" }}
          className="whitespace-pre-wrap leading-relaxed "
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
