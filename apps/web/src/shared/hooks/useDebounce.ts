import { useEffect, useRef } from "react"

export const useDebounce = <T extends (...args: unknown[]) => unknown>(
  cb: T,
  delay: number = 500
) => {
  const callbackRef = useRef(cb)
  const timerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    callbackRef.current = cb
  }, [cb])

  const debounceFunction = (...args: Parameters<T>) => {
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current)
    }

    timerIdRef.current = setTimeout(() => {
      return callbackRef.current(...args)
    }, delay)
  }

  useEffect(() => {
    return () => {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current)
      }
    }
  }, [])

  return debounceFunction
}
