import { getButtonStyleClass } from "../ui/IconButtonBase"
import { ClipIcon, ReloadIcon } from "../ui/icons"
import { DropzoneInputProps } from "react-dropzone"

interface UploadButtonProps {
  icon?: "clip" | "reload"
  inputDropZoneProps?: DropzoneInputProps
}

export const UploadButton = ({
  icon = "clip",
  inputDropZoneProps
}: UploadButtonProps) => {
  return (
    <label className="text-green-400 transition-colors cursor-pointer hover:text-green-600">
      <div className={getButtonStyleClass("primary")}>
        {icon === "clip" ? <ClipIcon /> : <ReloadIcon />}
      </div>

      <input
        className="absolute opacity-0 -z-1"
        type="file"
        {...inputDropZoneProps}
      />
    </label>
  )
}
