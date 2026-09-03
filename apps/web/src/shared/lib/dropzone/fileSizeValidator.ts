export const ACCEPTED_FILE_TYPES = {
  // Images
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/gif": [".gif"],
  "image/webp": [".webp"],

  // Videos
  "video/mp4": [".mp4"],
  "video/quicktime": [".mov"],
  "video/webm": [".webm"],

  // Raw
  "application/pdf": [".pdf"],
  "text/plain": [".txt"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx"
  ],
  "application/vnd.ms-excel": [".xls"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx"
  ],

  // Archives
  "application/zip": [".zip"],
  "application/x-rar-compressed": [".rar"],
  "application/x-7z-compressed": [".7z"]
}

export const MAX_FILES = 4

const MAX_SIZES = {
  image: 10 * 1024 * 1024, // 10mb
  raw: 10 * 1024 * 1024, // 10mb
  video: 100 * 1024 * 1024 // 100mb
}

function getFileCategory(mimeType: string): keyof typeof MAX_SIZES {
  if (mimeType.startsWith("image/")) return "image"
  if (mimeType.startsWith("video/")) return "video"
  return "raw"
}

export const fileSizeValidator = (file: File) => {
  const category = getFileCategory(file.type)
  const maxSize = MAX_SIZES[category]

  if (file.size > maxSize) {
    return {
      code: "file-too-large",
      message: `File is too large, max size is ${maxSize}mb for category ${category}`
    }
  }

  return null
}
