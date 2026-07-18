import {
  BadRequest,
  ConflictError,
  UploadError
} from "@/server/errors/domain.error"
import { MessageAttachment } from "@/shared/schemes/message.schema"
import { UTApi } from "uploadthing/server"
import { toMessageAttachment } from "./dto/toMessageAttachments"

const uploadAPi = new UTApi()

class FileStorageService {
  async uploadMessageFiles(files: File[]): Promise<MessageAttachment[]> {
    if (!files.length) {
      throw new BadRequest("No files provided for upload")
    }

    const res = await uploadAPi.uploadFiles(files)

    const successUploads = res.reduce<MessageAttachment[]>((acc, file) => {
      if (!file.data) return acc

      acc.push(toMessageAttachment(file.data))

      return acc
    }, [])

    if (!successUploads.length) {
      throw new UploadError("Failed to upload files")
    }

    return successUploads
  }

  async deleteByKeys(keys: string[]): Promise<boolean> {
    if (!keys.length) {
      throw new BadRequest("No keys provided for delete stored files")
    }

    const res = await uploadAPi.deleteFiles(keys)

    return res.success
  }
}

export const fileStorageService = new FileStorageService()
