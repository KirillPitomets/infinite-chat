export interface ExceptionPayload {
  status: string
  error: unknown
  timestamp: string
}

export interface ExceptionEvents {
  exception: (payload: ExceptionPayload) => void
}
