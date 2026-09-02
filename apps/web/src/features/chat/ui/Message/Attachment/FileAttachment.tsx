// features/chat/message/components/FileAttachment.tsx
import {
  FileTextIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileArchiveIcon
} from "lucide-react"

function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase()

  switch (ext) {
    case "pdf":
      return FileTextIcon
    case "doc":
    case "docx":
      return FileTextIcon
    case "xls":
    case "xlsx":
    case "csv":
      return FileSpreadsheetIcon
    case "zip":
    case "rar":
    case "7z":
      return FileArchiveIcon
    default:
      return FileIcon
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export function FileAttachment({
  url,
  name,
  size
}: {
  url: string
  name: string
  size: number
}) {
  const Icon = getFileIcon(name)

  return (
    <a
      href={url}
      download={name}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 rounded-lg border border-neutral-700 hover:bg-neutral-800 transition-colors max-w-xs"
    >
      <Icon className="w-8 h-8 shrink-0 text-neutral-400" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{name}</p>
        <p className="text-xs text-neutral-500">{formatFileSize(size)}</p>
      </div>
    </a>
  )
}
