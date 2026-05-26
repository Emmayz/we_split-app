"use client";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: "1px solid #1F1F2D",
        padding: "48px 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 40,
        }}
      >
        {/* Top row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 32,
          }}
        >
          {/* Brand */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 280 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 24, color: "#00E5FF", fontWeight: 700, lineHeight: 1 }}>÷</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#F0EEE7" }}>wesplit</span>
            </div>
            <p style={{ color: "#5A5A6B", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
              The simplest way to split bills and get reimbursed. UK only.
            </p>
          </div>

          {/* Links */}
          <div
            style={{
              display: "flex",
              gap: 48,
              flexWrap: "wrap",
            }}
          >
            <FooterGroup
              title="Product"
              links={[
                { label: "How it works", href: "#how-it-works" },
                { label: "Features", href: "#features" },
                { label: "FAQ", href: "#faq" },
              ]}
            />
            <FooterGroup
              title="Legal"
              links={[
                { label: "Privacy policy", href: "/privacy" },
                { label: "Terms of service", href: "/terms" },
              ]}
            />
            <FooterGroup
              title="Company"
              links={[
                { label: "Contact", href: "mailto:hello@wesplit.co" },
                { label: "Twitter / X", href: "#" },
              ]}
            />
          </div>
        </div>

        {/* Bottom row */}
        <div
          style={{
            borderTop: "1px solid #1F1F2D",
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p style={{ color: "#5A5A6B", fontSize: 12, margin: 0 }}>
            © {year} wesplit Ltd. Registered in England & Wales.
          </p>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <img
              src="https://cdn.brandfetch.io/idnrCPuv87/w/400/h/400/theme/dark/icon.png?c=1idnrCPuv87"
              alt=""
              style={{ height: 18, opacity: 0.4, display: "none" }}
            />
            <p style={{ color: "#5A5A6B", fontSize: 12, margin: 0 }}>
              Payments by{" "}
              <span style={{ color: "#8A8A9B" }}>Stripe</span>
            </p>
            <span style={{ color: "#1F1F2D" }}>·</span>
            <p style={{ color: "#5A5A6B", fontSize: 12, margin: 0 }}>
              UK GDPR compliant
            </p>
            <span style={{ color: "#1F1F2D" }}>·</span>
            <p style={{ color: "#5A5A6B", fontSize: 12, margin: 0 }}>
              PCI DSS via Stripe
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterGroup({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <p style={{ color: "#F0EEE7", fontSize: 13, fontWeight: 600, margin: 0 }}>{title}</p>
      {links.map((l) => (
        <a
          key={l.href}
          href={l.href}
          style={{
            color: "#5A5A6B",
            fontSize: 13,
            textDecoration: "none",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#8A8A9B")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#5A5A6B")}
        >
          {l.label}
        </a>
      ))}
    </div>
  );
}
