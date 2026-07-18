import { useState } from "react"
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
  const [isZoomed, setIsZoomed] = useState(false)

  const handleClose = () => {
    setIsZoomed(false)
    onClose()
  }

  return (
    <Dialog isOpen={isOpen} onClose={handleClose}>
      <div
        className={`flex items-center justify-center transition-transform duration-300 ${isZoomed ? "scale-200 cursor-zoom-out" : "scale-100 cursor-zoom-in"}`}
        onClick={e => {
          e.stopPropagation()
          setIsZoomed(prev => !prev)
        }}
      >
        <img
          className="max-h-[80vh] max-w-[90vw] object-contain"
          src={image.url}
          alt={image.alt}
        />
      </div>
    </Dialog>
  )
}

export default ImagePreviewDialog
