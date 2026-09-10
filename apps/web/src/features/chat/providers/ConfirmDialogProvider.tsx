"use client"
import { ConfirmDialog } from "@/shared/components/ConfirmDialog/ConfirmDialog"
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState
} from "react"

export type ConfirmOptions = {
  title: string
  des: string
  confirmLabel?: string
  cancelLabel?: string
}

type ConfirmState = ConfirmOptions & { resolve: (value: boolean) => void }

export const ConfirmDialogContext = createContext<
  (opt: ConfirmOptions) => Promise<Boolean>
>(null!)

export const ConfirmDialogProvider = ({ children }: PropsWithChildren) => {
  const [state, setState] = useState<ConfirmState | null>(null)

  const confirm = useCallback((opts: ConfirmOptions) => {
    return new Promise<boolean>(resolve => {
      setState({ ...opts, resolve })
    })
  }, [])

  const handleClose = (result: boolean) => {
    state?.resolve(result)

    setState(null)
  }

  return (
    <ConfirmDialogContext.Provider value={confirm}>
      {children}

      {state && (
        <ConfirmDialog
          open
          title={state.title}
          des={state.des}
          onCancel={() => handleClose(false)}
          onConfirm={() => handleClose(true)}
          cancelLabel={state.cancelLabel}
          confirmLabel={state.confirmLabel}
        />
      )}
    </ConfirmDialogContext.Provider>
  )
}

export const useConfirm = () => {
  const ctx = useContext(ConfirmDialogContext)
  if (!ctx) throw new Error("useConfirm must be used within ConfirmProvider")
  return ctx
}
