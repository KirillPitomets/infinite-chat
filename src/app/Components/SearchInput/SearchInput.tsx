import Image from "next/image";

export default function SearchInput() {
  return (
    <label className="w-full flex items-center justify-center gap-3 py-1.5 px-5  rounded-2xl bg-stone-400/30">
      <Image width={10} height={10} src="/search.svg" alt="Search icon" />
      <input className="w-full" placeholder="Search" />
    </label>
  )
}
