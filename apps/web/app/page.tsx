import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px",
        padding: "24px",
        backgroundColor: "#0B0B14",
      }}
    >
      <div style={{ fontSize: "80px", color: "#00E5FF", lineHeight: 1 }}>÷</div>
      <h1 style={{ fontSize: "32px", fontWeight: 700, color: "#F0EEE7", margin: 0 }}>wesplit</h1>
      <p style={{ color: "#8A8A9B", margin: 0 }}>Pay once. Settle in minutes.</p>
      <p style={{ color: "#5A5A6B", fontSize: "14px", margin: 0 }}>
        You need a payment link to use this app.
      </p>
    </main>
  );
}
