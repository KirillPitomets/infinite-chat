import { uploadToCloudinary } from "@/shared/lib/upload/uploadToCloudinary"
import { CloudinaryPresignSlot } from "@/shared/types/api.type"
import { useCallback } from "react"

export const useFileUpload = (slot: CloudinaryPresignSlot) => {
  const upload = useCallback(
    async (file: File) => {
      const cloudinaryResponse = await uploadToCloudinary(slot, file)
      console.log(cloudinaryResponse)
      return cloudinaryResponse
    },
    [slot]
  )

  return upload
}
