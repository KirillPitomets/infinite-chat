import { InputHTMLAttributes } from "react"
import { ClipIcon, ReloadIcon } from "../ui/icons"
import { DropzoneInputProps } from "react-dropzone"

interface UploadButtonProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: "clip" | "reload"
  inputDropZoneProps?: DropzoneInputProps
}

export const UploadButton = ({
  icon = "clip",
  accept = "image/*",
  inputDropZoneProps,
  ...props
}: UploadButtonProps) => {
  return (
    <label className="text-green-400 transition-colors cursor-pointer hover:text-green-600">
      {icon === "clip" ? <ClipIcon /> : <ReloadIcon />}
      <input
        className="absolute opacity-0 -z-1"
        type="file"
        // accept={accept}
        // multiple
        {...props}
        {...inputDropZoneProps}
      />
    </label>
  )
}
