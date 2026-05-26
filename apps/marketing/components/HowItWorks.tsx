const steps = [
  {
    number: "01",
    icon: "📷",
    title: "Scan the receipt",
    description:
      "Open wesplit, point your camera at any receipt, and the app extracts every line item automatically.",
  },
  {
    number: "02",
    icon: "÷",
    title: "Split the bill",
    description:
      "Split evenly or assign specific items to specific people. Add a tip or service charge with one tap.",
  },
  {
    number: "03",
    icon: "💸",
    title: "Everyone pays their share",
    description:
      "Each person gets a personal payment link via text or email. They pay in seconds — no app, no sign-up.",
  },
  {
    number: "04",
    icon: "🏦",
    title: "Money hits your account",
    description:
      "Payments collect in your wesplit wallet. Withdraw to your UK bank account whenever you like via Faster Payments.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      style={{
        padding: "100px 24px",
        maxWidth: 1120,
        margin: "0 auto",
      }}
    >
      {/* Section header */}
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <p style={{ color: "#00E5FF", fontWeight: 600, fontSize: 13, letterSpacing: "0.08em", marginBottom: 12 }}>
          HOW IT WORKS
        </p>
        <h2
          style={{
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 700,
            color: "#F0EEE7",
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          From bill to settled in four steps
        </h2>
      </div>

      {/* Steps */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 2,
        }}
      >
        {steps.map((step, i) => (
          <div
            key={i}
            style={{
              backgroundColor: "#14141F",
              border: "1px solid #1F1F2D",
              borderRadius: 20,
              padding: "32px 28px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Step number watermark */}
            <div
              style={{
                position: "absolute",
                top: 16,
                right: 20,
                fontSize: 56,
                fontWeight: 700,
                color: "#1C1C2A",
                lineHeight: 1,
                userSelect: "none",
              }}
            >
              {step.number}
            </div>

            {/* Icon */}
            <div style={{ fontSize: 36, marginBottom: 20, lineHeight: 1 }}>
              {step.icon}
            </div>

            <h3
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "#F0EEE7",
                margin: "0 0 12px",
              }}
            >
              {step.title}
            </h3>
            <p
              style={{
                color: "#8A8A9B",
                fontSize: 15,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {step.description}
            </p>

            {/* Connector line (not last) */}
            {i < steps.length - 1 && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  right: -1,
                  width: 2,
                  height: 40,
                  backgroundColor: "#1F1F2D",
                  transform: "translateY(-50%)",
                  display: "none",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
