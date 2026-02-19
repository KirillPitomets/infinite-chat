import {ChangeEvent, useEffect, useLayoutEffect, useRef, useState} from "react"
import EmojiPicker, {EmojiClickData} from "emoji-picker-react"
import {SendIcon} from "@/components/ui/icons"
import {IconButtonBase} from "@/components/ui/IconButtonBase"

type ChatInputProps = {
  onSubmit: (value: string) => void
  onCancel?: () => void
  initialValue: string
  // submitLabel: "save" | "send"
}

export function ChatInputUI({initialValue, onSubmit}: ChatInputProps) {
  const [value, setValue] = useState<string>(initialValue)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isOpenEmojiPicker, setIsOpenEmojiPicker] = useState(false)
  const [latestEmoji, setLatestEmoji] = useState("😀")

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
    <label className="flex items-center border-t border-zinc-300 p-5 space-x-2 relative">
      {isOpenEmojiPicker && (
        <div
          onClick={toggleEmojiPicker}
          className="w-screen h-screen  bg-black/4 absolute bottom-0 left-0 z-100"
        />
      )}
      <div className="flex flex-1 items-center bg-zinc-400/50 rounded-2xl transition-colors focus:bg-zinc-400">
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
            className="p-2 cursor-pointer transition-transform hover:scale-150"
            onClick={toggleEmojiPicker}
          >
            {latestEmoji}
          </button>
          <div className="absolute bottom-full right-0 z-101">
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
    </label>
  )
}
