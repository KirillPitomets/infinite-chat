"use client"
import {
  ChangeEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react"
import EmojiPicker, { EmojiClickData } from "emoji-picker-react"
import { IconButtonBase } from "@/shared/components/ui/IconButtonBase"
import { SendIcon } from "@/shared/components/ui/icons"
import { UploadButton } from "@/shared/components/UploadButton"
import { PreviewFiles } from "@/shared/components/ui/PreviewFiles/PreviewFiles"
import { PreviewFile } from "@/shared/components/ui/PreviewFiles/PreviewFile.types"

type ChatInputProps = {
  onSubmit: (value: string) => void
  onCancel?: () => void
  initialValue: string
}

export function ChatInputUI({ initialValue, onSubmit }: ChatInputProps) {
  const [value, setValue] = useState<string>(initialValue)
  // const [files, setFiles] = useState<File[]>([])
  const [files, setFiles] = useState<PreviewFile[]>([])
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

  const handleUploadButtonChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const inputFiles = e.target.files

    if (!inputFiles?.length) return

    const tempInputFiles: PreviewFile[] = []

    for (const file of inputFiles) {
      if (!file.name.match(/\.(jpg|jpeg|png|gif)$/)) {
        tempInputFiles.push({ isImg: false, file, preview: "" })
      } else {
        tempInputFiles.push({
          isImg: true,
          file,
          preview: URL.createObjectURL(file)
        })
      }
    }
    console.log("ECHO INPUT UI, UPLOAD BUTTON: ", tempInputFiles)
    setFiles(prev => [...prev, ...tempInputFiles])
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

  return (
    <div>
      <PreviewFiles
        files={files}
        removeFile={filename =>
          setFiles(prev =>
            prev.filter(prevFile => !(prevFile.file.name === filename))
          )
        }
      />
      <div className="relative flex items-center gap-2 p-5 space-x-2 border-t border-zinc-300">
        <UploadButton onChange={handleUploadButtonChange} />

        {isOpenEmojiPicker && (
          <div
            onClick={toggleEmojiPicker}
            className="absolute bottom-0 left-0 w-screen h-screen bg-black/4 z-100"
          />
        )}
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
