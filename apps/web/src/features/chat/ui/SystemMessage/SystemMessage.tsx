import { Message } from "@/shared/types/api.type"
import { MessageContent } from "../Message/Content"
import { formatDate } from "date-fns"

type SystemMessageProps = {
  msgData: Message
}

export const SystemMessage = ({ msgData }: SystemMessageProps) => {
  return (
    <div className={`w-full flex justify-center break-all relative`}>
      <div className="w-full h-full border-t border-white absolute top-0 l-0 z-[-1] translate-y-[50%]"></div>

      <div
        style={{ background: `var(--background)` }}
        className={`flex flex-col gap-2 px-2`}
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <MessageContent
            attachments={[]}
            onPreviewImage={() => {}}
            content={msgData.systemContent}
            messageStatus={"sent"}
          />

          <div className="flex justify-end space-x-2">
            <p className={`text-sm opacity-50`}>
              {formatDate(msgData.createdAt, "HH:mm")}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
