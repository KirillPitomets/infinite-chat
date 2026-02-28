import { useEffect, useMemo, useState } from "react"
import { FileAccepted, TrashIcon } from "../icons"
import { PreviewFile } from "./PreviewFile.types"

type PreviewFilesProps = {
  files: File[]
  removeFile: (filename: string) => void
}

export const PreviewFiles = ({ files, removeFile }: PreviewFilesProps) => {
  const previewFiles: PreviewFile[] = useMemo(() => {
    return files.map(file => {
      const isImg = file.type.startsWith("image/")

      return {
        isImg,
        data: file,
        preview: isImg ? URL.createObjectURL(file) : ""
      }
    })
  }, [files])

  useEffect(() => {
    return () => {
      previewFiles.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview)
        }
      })
    }
  }, [previewFiles])

  return (
    <ul className="flex flex-wrap items-end gap-2">
      {previewFiles.map((file, indx) => (
        <li key={`${file.data.name}-${indx}`} className="relative group">
          <div className="">
            {file.isImg ? (
              <img
                className="max-w-[200px] max-h-[290px] object-contain"
                src={file.preview}
                alt={file.data.name}
              />
            ) : (
              <div className="w-[150px] h-[150px] flex flex-col items-center justify-center bg-zinc-400 rounded-2xl">
                <FileAccepted className="w-10 h-10" />
                <p className="w-20 truncate text-[14px]">
                  {file.data.name.split(".")[0]}
                </p>
                <span> .{file.data.name.split(".")[1]} </span>
              </div>
            )}
            <button
              className="absolute p-2 transition-opacity bg-red-400 opacity-0 cursor-pointer top-2 right-2 rounded-2xl group-hover:opacity-100"
              onClick={() => removeFile(file.data.name)}
            >
              <TrashIcon />
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
