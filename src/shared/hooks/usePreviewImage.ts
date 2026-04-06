import { useState } from "react"

export const usePreviewImageDialog = () => {
  const [previewImage, setPreviewImage] = useState<{
    alt: string
    url: string
  }>({ alt: "", url: "" })
  const [isOpenImagePreview, setIsOpenImagePreview] = useState(false)

  const handleImagePreviewDialog = (image: { alt: string; url: string }) => {
    setPreviewImage(image)
    setIsOpenImagePreview(true)
  }

  const closePreviewImageDialog = () => setIsOpenImagePreview(false)

  return {
    isOpenImagePreview,
    previewImage,
    handleImagePreviewDialog,
    closePreviewImageDialog
  }
}
