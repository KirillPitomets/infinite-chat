import { InputHTMLAttributes } from "react"
import { ClipIcon } from "../ui/icons"

export const UploadButton = ({
  accept = "image/*",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <label className="text-green-400 transition-colors cursor-pointer hover:text-green-600">
      <ClipIcon />
      <input
        className="absolute opacity-0 -z-1"
        type="file"
        accept={accept}
        multiple
        {...props}
      />
    </label>
  )
}
