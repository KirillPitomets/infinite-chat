import { CloudinaryPresignSlot } from "@/shared/types/api.type"
import { CloudinaryUploadResponse } from "@/shared/types/cloudinary.type"

export const uploadToCloudinary = async (
  slot: CloudinaryPresignSlot,
  file: File,
  onProgress?: (pct: number) => void
): Promise<CloudinaryUploadResponse> => {
  const form = new FormData()

  form.append("file", file)
  form.append("api_key", slot.apiKey)
  form.append("timestamp", slot.timestamp)
  form.append("folder", slot.folder)
  form.append("signature", slot.signature)
  form.append("public_id", slot.publicId)
  form.append("overwrite", "false")

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${slot.cloudName}/auto/upload`,
    { method: "POST", body: form }
  )

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null)
    console.error("Cloudinary error:", errorBody)
    throw new Error(`Upload failed: ${errorBody?.error?.message ?? res.status}`)
  }

  return res.json()
}
