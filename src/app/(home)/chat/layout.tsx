import SearchInput from "@/app/Components/SearchInput/SearchInput";
import Sidebar from "@/app/Components/Sidebar/Sidebar";
import { chats } from "./chats.data";


export default function ChatLayot({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex">
      <Sidebar />
      
      <div className="px-5 py-7.5">
        <h2 className="text-xl font-bold mb-2">Messages</h2>

        <SearchInput  />
        {
          chats.map( chat => (
            <>
              {/* TODO */}
            </>
          ))
        }
      </div>

      {children}
    </main>
  )
}
