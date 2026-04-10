export const SkyLoader = () => {
  return (
    <div
      className="w-[175px] h-[80px] mx-auto relative box-border"
      style={{
        backgroundImage: `
          radial-gradient(circle 25px at 25px 25px, var(--color-zinc-200) 100%, transparent 0),
          radial-gradient(circle 50px at 50px 50px, var(--color-zinc-200) 100%, transparent 0),
          radial-gradient(circle 25px at 25px 25px, var(--color-zinc-200) 100%, transparent 0),
          linear-gradient(var(--color-zinc-200) 50px, transparent 0)
        `,
        backgroundSize: "50px 50px, 100px 76px, 50px 50px, 120px 40px",
        backgroundPosition: "0px 30px, 37px 0px, 122px 30px, 25px 40px",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="absolute left-0 right-0 mx-auto bottom-[20px] w-[36px] h-[36px] rounded-full border-[5px] border-transparent border-t-[var(--color-green-400)] animate-spin"></div>
    </div>
  )
}
