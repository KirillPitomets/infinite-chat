import { UIAttachment } from "@/features/chat/message/model/message.types"

export const fillMissingAttachment = (
  attachments: UIAttachment[],
  awaitingCountAttachments: number = 0
): UIAttachment[] => {
  const countMissingAttachments = awaitingCountAttachments - attachments.length

  if (countMissingAttachments <= 0) {
    return attachments
  } else {
    const tempAttachments: UIAttachment[] = Array.from(
      { length: countMissingAttachments },
      () => ({
        key: `temp-${Date.now()}-missingAttachment`,
        name: "",
        size: 0,
        type: "VIDEO",
        url: "",
        isError: true
      })
    )
    return [...attachments, ...tempAttachments]
  }
}
