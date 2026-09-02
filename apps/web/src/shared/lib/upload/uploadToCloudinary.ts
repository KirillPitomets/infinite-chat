import { CloudinaryPresignSlot } from "@/shared/types/api.type"
import { CloudinaryUploadResponse } from "@/shared/types/cloudinary.type"

export const uploadToCloudinary = async (
  slot: CloudinaryPresignSlot,
  file: File,
  onProgress?: (pct: number) => void
): Promise<CloudinaryUploadResponse> => {
  return new Promise((resolve, reject) => {
    const form = new FormData()

    form.append("file", file)
    form.append("api_key", slot.apiKey)
    form.append("timestamp", slot.timestamp)
    form.append("folder", slot.folder)
    form.append("signature", slot.signature)
    form.append("public_id", slot.publicId)
    form.append("overwrite", "false")

    const xhr = new XMLHttpRequest()
    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${slot.cloudName}/auto/upload`
    )

    xhr.upload.onprogress = e => {
      if (e.lengthComputable) {
        onProgress?.(Math.round((e.loaded / e.total) * 100))
      }
    }

    xhr.onload = () => {
      if (xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText))
      } else {
        const errBody = JSON.parse(xhr.responseText || "{}")
        reject(
          new Error(errBody?.error?.message || `Upload failed: ${xhr.status}`)
        )
      }
    }

    xhr.onerror = () => reject(new Error("Network error during upload"))
    xhr.send(form)
  })
}
