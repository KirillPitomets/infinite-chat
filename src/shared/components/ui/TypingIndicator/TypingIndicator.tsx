type TypingIndicatorProps = {
  colorMode?: "light" | "dark"
}

export const TypingIndicator = ({
  colorMode = "light"
}: TypingIndicatorProps) => {
  return (
    <div
      className={`flex gap-1 
        ${
          colorMode === "light"
            ? "text-white dark:text-black"
            : "text-black dark:text-white"
        }`}
    >
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
