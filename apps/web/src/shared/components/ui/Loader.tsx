type LoaderProps = {
  size?: number
  thickness?: number
}

export function Loader({ size = 24, thickness = 3 }: LoaderProps) {
  return (
    <div
      className={
        "animate-spin rounded-full border-solid border-current border-t-transparent"
      }
      style={{
        width: size,
        height: size,
        borderWidth: thickness
      }}
    />
  )
}
