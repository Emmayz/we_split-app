"use client";

import Link from "next/link";

export function Hero() {
  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 24px 80px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,229,255,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", maxWidth: 760, margin: "0 auto" }}>
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            backgroundColor: "#00E5FF12",
            border: "1px solid #00E5FF30",
            borderRadius: 100,
            padding: "6px 16px",
            marginBottom: 32,
          }}
        >
          <span style={{ fontSize: 12, color: "#00E5FF", fontWeight: 600, letterSpacing: "0.05em" }}>
            NOW AVAILABLE IN THE UK
          </span>
        </div>

        {/* Logo mark */}
        <div
          style={{
            fontSize: 96,
            color: "#00E5FF",
            lineHeight: 1,
            marginBottom: 24,
            textShadow: "0 0 80px rgba(0,229,255,0.4)",
            fontWeight: 700,
          }}
        >
          ÷
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: "clamp(36px, 6vw, 72px)",
            fontWeight: 700,
            color: "#F0EEE7",
            lineHeight: 1.1,
            margin: "0 0 20px",
            letterSpacing: "-0.02em",
          }}
        >
          Pay once.{" "}
          <span style={{ color: "#00E5FF" }}>Settle in minutes.</span>
        </h1>

        {/* Subheadline */}
        <p
          style={{
            fontSize: "clamp(16px, 2vw, 20px)",
            color: "#8A8A9B",
            lineHeight: 1.6,
            margin: "0 auto 48px",
            maxWidth: 560,
          }}
        >
          One person pays the bill. Everyone else gets a payment link — no app
          download required. Funds land straight in your UK bank account.
        </p>

        {/* CTAs */}
        <div
          id="get-started"
          style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}
        >
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
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              transition: "opacity 0.15s, transform 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.9";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "none";
            }}
          >
            <AppStoreIcon />
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
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              transition: "border-color 0.15s, transform 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#00E5FF40";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#1F1F2D";
              e.currentTarget.style.transform = "none";
            }}
          >
            <PlayStoreIcon />
            Google Play
          </a>
        </div>

        {/* Social proof */}
        <p style={{ marginTop: 40, color: "#5A5A6B", fontSize: 13 }}>
          No subscription. No hidden fees. Just splits.
        </p>
      </div>
    </section>
  );
}

function AppStoreIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function PlayStoreIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 20.5v-17c0-.83 1-.95 1.39-.4l14 8.5c.36.22.36.78 0 1L4.39 20.9c-.39.55-1.39.43-1.39-.4zm2-14.31v11.62l9.8-5.81L5 6.19z" />
    </svg>
  );
}
