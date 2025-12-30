interface Props {
  children: React.ReactNode
  isActive?: boolean
  styles?: string
}

export function IconButtonBase({children, styles, isActive}: Props) {
  return (
    <div
      className={`
        flex justify-center items-center text-green-600
        ${isActive && "bg-green-600 text-white"}
        p-3 rounded-2xl transition-colors hover:bg-green-600 hover:text-white ${styles}`}
    >
      <div className="w-4.5 h-4.5 flex items-center justify-center">
        {children}
      </div>
    </div>
  )
}
