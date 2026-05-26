"use client";

export function CTA() {
  return (
    <section
      style={{
        padding: "80px 24px 100px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 500,
          height: 300,
          background: "radial-gradient(ellipse, rgba(0,229,255,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", maxWidth: 560, margin: "0 auto" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 72,
            height: 72,
            borderRadius: "50%",
            backgroundColor: "#00E5FF12",
            border: "1px solid #00E5FF30",
            fontSize: 36,
            color: "#00E5FF",
            fontWeight: 700,
            marginBottom: 28,
          }}
        >
          ÷
        </div>

        <h2
          style={{
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 700,
            color: "#F0EEE7",
            margin: "0 0 16px",
            letterSpacing: "-0.02em",
          }}
        >
          Ready to stop chasing people for money?
        </h2>
        <p style={{ color: "#8A8A9B", fontSize: 16, margin: "0 0 40px", lineHeight: 1.6 }}>
          Download wesplit and split your next bill in under a minute.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="#"
            style={{
              backgroundColor: "#00E5FF",
              color: "#0B0B14",
              padding: "14px 32px",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 700,
              textDecoration: "none",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            App Store
          </a>
          <a
            href="#"
            style={{
              backgroundColor: "transparent",
              color: "#F0EEE7",
              padding: "14px 32px",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              textDecoration: "none",
              border: "1px solid #1F1F2D",
              transition: "border-color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#00E5FF40")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1F1F2D")}
          >
            Google Play
          </a>
        </div>
      </div>
    </section>
  );
}
