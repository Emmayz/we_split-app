import { DivisionLogo } from "../../../../components/DivisionLogo";

export default function ExpiredPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#0B0B14",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        gap: "24px",
        textAlign: "center",
      }}
    >
      <DivisionLogo size={72} color="#FF4D6D" />
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#F0EEE7", margin: 0 }}>
          This link has expired or already been used
        </h1>
        <p style={{ color: "#8A8A9B", margin: 0, fontSize: "15px" }}>
          Please contact the host to request a new payment link.
        </p>
      </div>
    </main>
  );
}
