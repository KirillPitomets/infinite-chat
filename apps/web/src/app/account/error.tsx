"use client"

export default function Error({
  error,
  reset
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div>
      <p>Что-то пошло не так, попробуйте позже</p>
    </div>
  )
}
