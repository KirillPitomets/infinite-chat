import { RefObject, useEffect } from "react"

export const useOnClickOutside = (
  refs: RefObject<HTMLElement | null>[],
  isActive: boolean,
  onClose: () => void
) => {
  useEffect(() => {
    if (!isActive) return

    const handleClickOutside = (e: MouseEvent) => {
      const isOutsideAll = refs.every(
        ref => ref.current && !ref.current.contains(e.target as Node)
      )
      if (isOutsideAll) onClose()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isActive, refs, onClose])
}
