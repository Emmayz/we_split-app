export function GuestSection() {
  return (
    <section
      style={{
        padding: "100px 24px",
        maxWidth: 1120,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 48,
          alignItems: "center",
        }}
      >
        {/* Left: text */}
        <div>
          <p
            style={{
              color: "#00E5FF",
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: "0.08em",
              marginBottom: 16,
            }}
          >
            FOR YOUR GROUP
          </p>
          <h2
            style={{
              fontSize: "clamp(26px, 3.5vw, 42px)",
              fontWeight: 700,
              color: "#F0EEE7",
              margin: "0 0 20px",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
          >
            Your friends don&apos;t need the app
          </h2>
          <p
            style={{
              color: "#8A8A9B",
              fontSize: 16,
              lineHeight: 1.7,
              margin: "0 0 32px",
            }}
          >
            Guests pay anonymously through a secure web page — just their phone
            number or email for a receipt, then they&apos;re done. No account,
            no download, no friction.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              "Tap the link in their text or email",
              "Enter payment details — Apple Pay & Google Pay supported",
              "Done. Receipt sent instantly.",
            ].map((point, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    backgroundColor: "#00FF9420",
                    border: "1px solid #00FF9440",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  <span style={{ color: "#00FF94", fontSize: 11, fontWeight: 700 }}>✓</span>
                </div>
                <p style={{ color: "#F0EEE7", fontSize: 15, margin: 0, lineHeight: 1.5 }}>
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: mock payment card */}
        <div
          style={{
            backgroundColor: "#14141F",
            border: "1px solid #1F1F2D",
            borderRadius: 24,
            padding: "32px",
            maxWidth: 380,
            margin: "0 auto",
            width: "100%",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              marginBottom: 28,
            }}
          >
            <span style={{ fontSize: 32, color: "#00E5FF", fontWeight: 700 }}>÷</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#F0EEE7" }}>wesplit</span>
          </div>

          {/* Bill info */}
          <div
            style={{
              backgroundColor: "#1C1C2A",
              borderRadius: 16,
              padding: "20px",
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            <p style={{ color: "#8A8A9B", margin: "0 0 4px", fontSize: 13 }}>
              Alex is requesting your share of
            </p>
            <p style={{ color: "#F0EEE7", fontWeight: 600, margin: "0 0 16px" }}>
              Friday Dinner 🍽️
            </p>
            <p
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: "#F0EEE7",
                margin: 0,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              £23.00
            </p>
            <p style={{ color: "#8A8A9B", fontSize: 13, margin: "4px 0 0" }}>
              Jordan&apos;s share
            </p>
          </div>

          {/* Contact input mock */}
          <div
            style={{
              backgroundColor: "#14141F",
              border: "1px solid #00E5FF",
              borderRadius: 12,
              padding: "12px 16px",
              marginBottom: 16,
              fontSize: 14,
              color: "#5A5A6B",
            }}
          >
            jordan@example.com
          </div>

          {/* Pay button mock */}
          <div
            style={{
              backgroundColor: "#00E5FF",
              borderRadius: 12,
              padding: "14px",
              textAlign: "center",
              fontSize: 15,
              fontWeight: 700,
              color: "#0B0B14",
            }}
          >
            Pay £23.00
          </div>

          <p
            style={{
              textAlign: "center",
              color: "#5A5A6B",
              fontSize: 11,
              marginTop: 16,
              marginBottom: 0,
            }}
          >
            Secured by Stripe · PCI DSS compliant
          </p>
        </div>
      </div>
    </section>
  );
}
