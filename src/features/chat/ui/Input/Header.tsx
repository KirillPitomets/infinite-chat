import { IconButtonBase } from "@/shared/components/ui/IconButtonBase"
import { CrossIcon, FileAccepted } from "@/shared/components/ui/icons"

type InputHeaderProps = {
  title: string
  content?: string | null | undefined
  countAttachments?: number | null | undefined
  onCancel: () => void
}

export const InputHeader = ({
  title,
  content,
  countAttachments = 2,
  onCancel
}: InputHeaderProps) => {
  return (
    <div className="flex justify-between items-center w-full p-4 border border-zinc-300">
      <div className="w-full space-y-2">
        <p className="font-semibold">{title}: </p>
        {content && (
          <p
            className={`w-full bg-zinc-800 dark:bg-zinc-300 truncate max-w-175 px-2 py-1 ml-1 `}
          >
            {content}
          </p>
        )}
        {!content && countAttachments && (
          <p className="flex gap-1 truncate max-w-175 pl-2 font-semibold uppercase opacity-60">
            <FileAccepted />
            {countAttachments} Files
          </p>
        )}
      </div>
      <button onClick={onCancel}>
        <IconButtonBase>
          <CrossIcon />
        </IconButtonBase>
      </button>
    </div>
  )
}
