import { ConfirmOptions } from "@/features/chat/providers/ConfirmDialogProvider"
import { Dialog } from "../Dialog/Dialog"
import { Button } from "../ui/Button"

interface ConfirmDialog extends ConfirmOptions {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmDialog = ({
  title,
  des,
  open,
  onCancel,
  onConfirm,
  cancelLabel,
  confirmLabel
}: ConfirmDialog) => {
  return (
    <Dialog isOpen={open} onClose={onCancel}>
      <div className="dark:bg-zinc-900 p-5 rounded-sm flex flex-col gap-5 ">
        <div>
          <h3 className="text-2xl font-bold">{title}</h3>
          <p className="">{des}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={onCancel}>{cancelLabel || "Cancel"}</Button>
          <Button onClick={onConfirm} tone="danger">
            {confirmLabel || "Confirm"}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
