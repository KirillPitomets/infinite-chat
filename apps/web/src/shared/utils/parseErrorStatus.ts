export function parseErrorMessage(message: string): {
  status: number | null
  text: string
} {
  const match = message.match(/^\[(\d+)\]\s*(.*)$/)

  if (!match) {
    return { status: null, text: message }
  }

  return {
    status: Number(match[1]),
    text: match[2]
  }
}
