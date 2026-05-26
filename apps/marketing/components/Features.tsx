"use client";

const features = [
  {
    icon: "📲",
    title: "No app for guests",
    description:
      "Your friends never need to download anything. They tap a link, enter their card details, and they're done.",
    accent: false,
  },
  {
    icon: "⚡",
    title: "Instant Faster Payments",
    description:
      "Withdraw your collected funds to any UK bank account in minutes, not days. Powered by Faster Payments.",
    accent: false,
  },
  {
    icon: "📷",
    title: "AI receipt scanning",
    description:
      "Point your camera at any receipt and every line item is extracted automatically. No manual entry.",
    accent: false,
  },
  {
    icon: "🔒",
    title: "Bank-grade security",
    description:
      "Payments processed by Stripe with Strong Customer Authentication. PCI DSS compliant. UK GDPR ready.",
    accent: false,
  },
  {
    icon: "✉️",
    title: "SMS & email links",
    description:
      "Send payment requests to any phone number or email address. Guests choose how they want to pay.",
    accent: false,
  },
  {
    icon: "💳",
    title: "Apple Pay & Google Pay",
    description:
      "Guests can pay with their saved cards in one tap — no typing required. Conversion made easy.",
    accent: true,
  },
];

export function Features() {
  return (
    <section
      id="features"
      style={{
        padding: "100px 24px",
        backgroundColor: "#0D0D18",
        borderTop: "1px solid #1F1F2D",
        borderBottom: "1px solid #1F1F2D",
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ color: "#00E5FF", fontWeight: 600, fontSize: 13, letterSpacing: "0.08em", marginBottom: 12 }}>
            FEATURES
          </p>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 700,
              color: "#F0EEE7",
              margin: "0 auto 16px",
              letterSpacing: "-0.02em",
              maxWidth: 600,
            }}
          >
            Everything you need to get reimbursed
          </h2>
          <p style={{ color: "#8A8A9B", fontSize: 16, maxWidth: 480, margin: "0 auto" }}>
            Built specifically for the UK. Designed to be the fastest way to
            split a bill and collect your money.
          </p>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                backgroundColor: f.accent ? "#00E5FF0A" : "#14141F",
                border: `1px solid ${f.accent ? "#00E5FF30" : "#1F1F2D"}`,
                borderRadius: 20,
                padding: "28px 28px",
                transition: "border-color 0.2s, transform 0.2s",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = f.accent ? "#00E5FF60" : "#2A2A3D";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = f.accent ? "#00E5FF30" : "#1F1F2D";
                (e.currentTarget as HTMLDivElement).style.transform = "none";
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 16, lineHeight: 1 }}>{f.icon}</div>
              <h3
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  color: f.accent ? "#00E5FF" : "#F0EEE7",
                  margin: "0 0 10px",
                }}
              >
                {f.title}
              </h3>
              <p style={{ color: "#8A8A9B", fontSize: 14, lineHeight: 1.65, margin: 0 }}>
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
