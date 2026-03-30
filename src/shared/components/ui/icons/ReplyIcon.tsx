import { SVGProps } from "react"

export function ReplyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="17"
      height="18"
      // viewBox="0 0 17 19"
      viewBox="0 0 128 128"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g>
        <path
          d="M120 116a3.998 3.998 0 0 1-3.578-2.211C109.016 98.977 102.004 84.957 64 84.047V112a4 4 0 0 1-6.715 2.937l-52-48C4.465 66.184 4 65.117 4 64s.465-2.184 1.285-2.938l52-48a4.009 4.009 0 0 1 4.32-.727A4.002 4.002 0 0 1 64 16v28.047c55.402 1.375 60 31.605 60 67.953a4.007 4.007 0 0 1-3.082 3.895c-.305.07-.613.105-.918.105zM13.898 64 56 102.863V80c0-2.211 1.789-4 4-4 33.168 0 47.289 9.258 55.574 20.387C113.703 69.09 104.188 52 60 52c-2.211 0-4-1.789-4-4V25.137z"
          fill="currentColor"
          data-original="currentColor"
        ></path>
      </g>
    </svg>
  )
}
