"use client"

export const CloudLoader = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="realtive flex flex-col items-center">
        <svg
          width="220"
          height="180"
          viewBox="0 0 120 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="cloud-bounce"
        >
          <path
            d="M30 70C15 70 10 55 20 50C20 35 40 25 50 30C55 15 80 15 85 35C100 35 100 50 95 60C95 75 80 75 70 70H30Z"
            fill="#E5E7EB"
          />
          <circle className="eye" cx="50" cy="45" r="3" fill="#374151" />
          <circle className="eye" cx="70" cy="45" r="3" fill="#374151" />
          <path
            d="M50 55C55 60 65 60 70 55"
            stroke="#374151"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        <p className="flex items-end mt-2 text-sm text-gray-500 ">
          Loading
          <span className="block animate-bounce text-2xl">.</span>
          <span
            className="block animate-bounce text-2xl"
            style={{ animationDelay: "250ms" }}
          >
            .
          </span>
          <span
            className="block animate-bounce text-2xl"
            style={{ animationDelay: "500ms" }}
          >
            .
          </span>
        </p>
      </div>
    </div>
  )
}
