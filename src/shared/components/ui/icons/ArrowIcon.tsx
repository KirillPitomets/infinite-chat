import { SVGProps } from "react"

export function ArrowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <title>Arrow-Left</title>{" "}
        <g
          id="Page-1"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <g id="Arrow-Left">
            <rect
              id="Rectangle"
              fillRule="nonzero"
              x="0"
              y="0"
              width="24"
              height="24"
            ></rect>
            <line
              x1="6"
              y1="12"
              x2="17.5"
              y2="12"
              id="Path"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {" "}
            </line>{" "}
            <path
              d="M14,8 L17.2929,11.2929 C17.6834,11.6834 17.6834,12.3166 17.2929,12.7071 L14,16"
              id="Path"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {" "}
            </path>{" "}
          </g>{" "}
        </g>{" "}
      </g>
    </svg>
  )
}
