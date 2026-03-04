"use client"
import { IconButtonBase } from "@/shared/components/ui/IconButtonBase"
import { SendIcon } from "@/shared/components/ui/icons"
import { PreviewFiles } from "@/shared/components/ui/PreviewFiles/PreviewFiles"
import { UploadButton } from "@/shared/components/UploadButton"
import EmojiPicker, { EmojiClickData } from "emoji-picker-react"
import {
  ChangeEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react"
import { createPortal } from "react-dom"
import { DropzoneInputProps } from "react-dropzone"
import toast from "react-hot-toast"

type ChatInputProps = {
  isEditInput?: boolean
  previewFiles: File[]
  initialValue?: string
  onCancel?: () => void
  onSubmit: (value: string) => void
  removePreviewFile: (filename: string) => void
  inputDropZoneProps?: DropzoneInputProps
}

export function ChatInputUI({
  isEditInput = false,
  initialValue = "",
  previewFiles = [],
  removePreviewFile,
  inputDropZoneProps,
  onSubmit
}: ChatInputProps) {
  const [value, setValue] = useState<string>(initialValue)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isOpenEmojiPicker, setIsOpenEmojiPicker] = useState(false)
  const [latestEmoji, setLatestEmoji] = useState("🥰")

  const MIN_TEXTAREA_HEIGHT = 32

  const abjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "unset"
      textareaRef.current.style.height = `${Math.max(
        MIN_TEXTAREA_HEIGHT,
        textareaRef.current.scrollHeight
      )}px`
    }
  }

  useLayoutEffect(abjustHeight, [value])

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
  }

  const onSubmitMessage = () => {
    if (value.trim().length > 0 && value.trim().length < 1000) {
      onSubmit(value)
      textareaRef.current?.focus()
      setValue("")
      // setFiles([])
      if (textareaRef.current) {
        textareaRef.current.style.height = "unset"
      }
    }
  }

  const onSubmitMessageViaEnter = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      if (!e.shiftKey) {
        e.preventDefault()
        onSubmitMessage()
      }
    }
  }


  const toggleEmojiPicker = () => {
    setIsOpenEmojiPicker(prev => !prev)
  }

  const handleEmojiClick = (emoji: EmojiClickData) => {
    setValue(prev => prev + emoji.emoji)
    setLatestEmoji(emoji.emoji)
  }

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    if (!isOpenEmojiPicker) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpenEmojiPicker(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpenEmojiPicker])

  return (
    <div>
      <PreviewFiles
        files={previewFiles}
        removeFile={filename => removePreviewFile(filename)}
      />
      <div className="relative flex items-center gap-2 p-5 space-x-2 border-t border-zinc-300">
        <UploadButton
          icon={isEditInput ? "reload" : "clip"}
          inputDropZoneProps={inputDropZoneProps}
          // onChange={handleUploadButtonChange}
        />
        <div className="flex items-center flex-1 transition-colors bg-zinc-400/50 rounded-2xl focus:bg-zinc-400">
          <textarea
            ref={textareaRef}
            onKeyDown={onSubmitMessageViaEnter}
            onChange={onChange}
            value={value}
            className="w-full max-h-62.5 px-4 py-2.5 text-zinc-900 outline-none resize-none"
            autoFocus
            rows={1}
            placeholder="Message..."
          />

          <div className="relative">
            <button
              className="p-2 transition-transform cursor-pointer hover:scale-150"
              onClick={toggleEmojiPicker}
            >
              {latestEmoji}
            </button>
            <div className="absolute right-0 bottom-full z-101">
              <EmojiPicker
                open={isOpenEmojiPicker}
                onEmojiClick={handleEmojiClick}
              />
              {createPortal(
                <>
                  {isOpenEmojiPicker && (
                    <div
                      onClick={toggleEmojiPicker}
                      className="absolute bottom-0 left-0 w-screen h-screen bg-black/10 z-100"
                    />
                  )}
                </>,
                document.body
              )}
            </div>
          </div>
        </div>

        <button onClick={onSubmitMessage} disabled={!value.trim()}>
          <IconButtonBase>
            <SendIcon />
          </IconButtonBase>
        </button>
      </div>
    </div>
  )
}

/*
        

*/
