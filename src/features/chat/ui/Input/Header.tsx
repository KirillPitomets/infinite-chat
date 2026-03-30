import { IconButtonBase } from "@/shared/components/ui/IconButtonBase"
import { CrossIcon } from "@/shared/components/ui/icons"

type InputHeaderProps = {
  title: string
  content: string
  onCancel: () => void
}

export const InputHeader = ({ title, content, onCancel }: InputHeaderProps) => {
  return (
    <div className="flex justify-between items-center w-full p-4 border border-zinc-300">
      <div>
        <p>{title}: </p>
        <p className="truncate max-w-175">{content}</p>
      </div>
      <button onClick={onCancel}>
        <IconButtonBase>
          <CrossIcon />
        </IconButtonBase>
      </button>
    </div>
  )
}
