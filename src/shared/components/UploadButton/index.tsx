import { ChangeEvent } from "react"
import { ClipIcon } from "../ui/icons"

type UploadButtonProps = {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export const UploadButton = ({ onChange }: UploadButtonProps) => {
  // const { startUpload, routeConfig, isUploading } = useUploadThing(
  //   "chatUploadImage",
  //   {
  //     onClientUploadComplete: () => {
  //       toast.success(`uploaded has ended`)
  //       setFiles([])
  //     },
  //     onUploadError: error => {
  //       toast.error(`error occurred while uploading ${error.message}`)
  //     },
  //     onUploadBegin: filename => {
  //       toast.success(`upload has begun for ${filename}`)
  //     }
  //   }
  // )

  return (
    <label className="text-green-400 transition-colors cursor-pointer hover:text-green-600">
      <ClipIcon />
      <input
        className="absolute opacity-0 -z-1"
        type="file"
        accept="image/*"
        multiple
        onChange={onChange}
      />
    </label>
  )
}
