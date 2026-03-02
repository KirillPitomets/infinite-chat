import React from "react"
import { Dialog } from "../../Dialog/Dialog"

type ImagePreviewDialogProps = {
  image: { alt: string; url: string }
  isOpen: boolean
  onClose: () => void
}

const ImagePreviewDialog = ({
  image,
  isOpen,
  onClose
}: ImagePreviewDialogProps) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <img className="max-w-full" src={image.url} alt={image.alt} />
    </Dialog>
  )
}

export default ImagePreviewDialog
