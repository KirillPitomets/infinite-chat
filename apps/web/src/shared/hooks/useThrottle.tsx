import { useCallback, useRef } from "react"

export const useThrottle = <T extends (...args: unknown[]) => unknown>(
  cb: T,
  delay: number = 500
) => {
  const lastCallRef = useRef(0)

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()
      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now
        cb(...args)
      }
    },
    [cb, delay]
  )
}
