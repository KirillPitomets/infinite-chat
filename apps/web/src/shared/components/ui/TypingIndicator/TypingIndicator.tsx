export const TypingIndicator = () => {
  return (
    <div className="flex gap-1 text-green-600">
      typing
      <div className=" animate-bounce">.</div>
      <div style={{ animationDelay: "200ms" }} className="animate-bounce">
        .
      </div>
      <div style={{ animationDelay: "400ms" }} className="animate-bounce">
        .
      </div>
    </div>
  )
}
