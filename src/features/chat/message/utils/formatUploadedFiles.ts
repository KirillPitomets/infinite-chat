import { MessageAttachment } from "@/shared/schemes/message.schema"
import { ClientUploadedFileData } from "uploadthing/types"

export const formatUploadedFiles = (
  files: ClientUploadedFileData<{
    uploadedBy: string | null
  }>[]
): MessageAttachment[] => {
  return files.map(file => ({
    key: file.key,
    name: file.name,
    size: file.size,
    url: file.ufsUrl,
    type: "IMAGE",
    height: 0,
    width: 0
  }))
}
