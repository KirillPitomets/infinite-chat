export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown
  ) {
    super(message)
  }
}

export async function unwrap<T>(
  promise: Promise<{ data?: T; error?: any; response: Response }>
): Promise<T> {
  const { data, error, response } = await promise

  if (error) {
    // RSC error boundayr can change custom class ApiError when send it from Server -> error.tsx (Client Component)
    // instanceof ApiError check doesn't guarantee correct code execution
    //  therefore inclue  status in the msg string and parase It within error.tsx (Client Component)
    // FORMAT - "[ERROR STATUS CODE] ERROR MESSAGE"
    const errMsg = error.message
      ? `[${response.status}] ${error.message}`
      : "Unknown error"
    throw new ApiError(response.status, errMsg, error)
  }

  return data as T
}
