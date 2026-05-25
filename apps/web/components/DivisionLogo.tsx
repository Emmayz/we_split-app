interface Props {
  size?: number;
  color?: string;
}

export function DivisionLogo({ size = 48, color = "#00E5FF" }: Props) {
  return (
    <div
      style={{
        fontSize: size,
        color,
        lineHeight: 1,
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 700,
        userSelect: "none",
      }}
    >
      ÷
    </div>
  );
}
