import { useState } from "react"
import toast from "react-hot-toast"

type useFilesType = {
  maxFiles: number
}

export const useFiles = ({maxFiles = 4}: useFilesType) => {
  const [files, setFiles] = useState<File[]>([])

  const addFiles = (newFiles: File[]) => {
    setFiles(prev => {
      const totalFiles = prev.length + newFiles.length

      if (totalFiles > maxFiles) {
        toast.error("You can upload only 4 files")
        return prev
      }

      return [...prev, ...newFiles]
    })
  }
  const removePreviewFile = (filename: string) =>
    setFiles(prev => prev.filter(file => file.name !== filename))
  const clearFiles = () => setFiles([])

  return { files, addFiles, clearFiles, removePreviewFile }
}
