import Link from "next/link"

type Props = {
  href: string
  children: React.ReactNode
  isActive: boolean
}

export default function NavLink({href, children, isActive}: Props) {
  return (
    <Link
      href={href}
      className={`
        flex justify-center items-center text-green-600
        ${isActive && 'bg-green-600 text-white'}
        p-3 rounded-2xl transition-colors hover:bg-green-600 hover:text-white`}
    >
      <div className="w-4.5 h-4.5 flex items-center justify-center">
        {children}
      </div>
    </Link>
  )
}
