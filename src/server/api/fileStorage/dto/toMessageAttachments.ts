import { MessageAttachment } from "@/shared/schemes/message.schema"
import { UploadedFileData } from "uploadthing/types"

export const toMessageAttachment = (
  file: UploadedFileData
): MessageAttachment => {
  return {
    key: file.key,
    name: file.name,
    size: file.size,
    url: file.ufsUrl,
    type: file.type
  }
}
