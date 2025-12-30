import Link from "next/link";
import Sidebar from "@/components/Sidebar/Sidebar";
import { PAGES } from "@/config/pages.config";

export default function Home() {
  return (
    <main className="flex">
      <Sidebar />

      <div className="w-full min-h-screen flex justify-center items-center">
        <div>
          <p className="text-center mb-4 text-2xl">Infinite Chat :D</p>
          <Link href={PAGES.CHAT} className="p-2 pl-3 pr-3 rounded-2xl bg-blue-400/60 text-2xl transition-[background] hover:bg-blue-500/60">
            Send new message your friends :)
          </Link>
        </div>
      </div>
    </main>
  );
}
