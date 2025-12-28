import Sidebar from "@/components/Sidebar/Sidebar"

export default function ChatLayot({children}: {children: React.ReactNode}) {
  return (
    <main className="flex max-h-screen overflow-hidden">
      <Sidebar />

      {children}
    </main>
  )
}
