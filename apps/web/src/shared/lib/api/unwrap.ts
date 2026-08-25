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
    console.log(error)
    throw new ApiError(response.status, error.message ?? "Unknown error", error)
  }

  return data as T
}
