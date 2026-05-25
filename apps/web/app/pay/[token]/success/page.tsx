"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { DivisionLogo } from "../../../../components/DivisionLogo";

function SuccessContent() {
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount");
  const contact = searchParams.get("contact");

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
      <div style={{ position: "relative", display: "inline-block" }}>
        <DivisionLogo size={72} />
        <div
          style={{
            position: "absolute",
            bottom: -4,
            right: -4,
            width: 28,
            height: 28,
            backgroundColor: "#00FF94",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            color: "#0B0B14",
          }}
        >
          ✓
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#F0EEE7", margin: 0 }}>
          {amount ? `You paid £${amount}` : "Payment received!"}
        </h1>
        {contact && (
          <p style={{ color: "#8A8A9B", margin: 0, fontSize: "15px" }}>
            Receipt sent to {contact}
          </p>
        )}
        <p style={{ color: "#5A5A6B", margin: "8px 0 0", fontSize: "13px" }}>
          Thank you for using wesplit
        </p>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", backgroundColor: "#0B0B14" }} />}>
      <SuccessContent />
    </Suspense>
  );
}
