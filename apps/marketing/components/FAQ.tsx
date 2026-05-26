"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Do my friends need to download wesplit?",
    a: "No. Guests pay through a secure web page — just a link in a text or email. They never need to create an account or install anything.",
  },
  {
    q: "How do I get my money back?",
    a: "Payments collect in your wesplit wallet as guests pay. You can withdraw the full balance to any UK bank account on demand via Faster Payments — usually arrives within minutes.",
  },
  {
    q: "Is wesplit available outside the UK?",
    a: "wesplit is UK-only at launch. We accept GBP payments and pay out to UK bank accounts. International support is on the roadmap.",
  },
  {
    q: "What payment methods do guests have?",
    a: "Guests can pay by debit or credit card, Apple Pay, or Google Pay. Strong Customer Authentication (SCA / 3D Secure) is applied where required by PSD2.",
  },
  {
    q: "How does receipt scanning work?",
    a: "You take a photo of any receipt inside the app. AI extracts every line item, price, VAT, service charge, and total automatically. You can then assign items to specific people or split evenly.",
  },
  {
    q: "Is my data safe?",
    a: "Payments are handled by Stripe and never touch wesplit servers in raw form. We are UK GDPR compliant. Card data is never stored by wesplit — it lives in Stripe's PCI DSS certified infrastructure.",
  },
  {
    q: "What happens if a guest doesn't pay?",
    a: "You can send payment reminders from the app at any time. You can also mark a member as manually paid if they paid you directly. Unpaid splits stay active until all shares are settled.",
  },
  {
    q: "Do I need to verify my identity?",
    a: "You need to complete a one-time identity check (powered by Stripe) before making your first withdrawal. This is a UK regulatory requirement for collecting payments.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="faq"
      style={{
        padding: "100px 24px",
        maxWidth: 720,
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <p style={{ color: "#00E5FF", fontWeight: 600, fontSize: 13, letterSpacing: "0.08em", marginBottom: 12 }}>
          FAQ
        </p>
        <h2
          style={{
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 700,
            color: "#F0EEE7",
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          Common questions
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {faqs.map((faq, i) => (
          <div
            key={i}
            style={{
              backgroundColor: open === i ? "#14141F" : "transparent",
              border: "1px solid",
              borderColor: open === i ? "#1F1F2D" : "transparent",
              borderRadius: 16,
              overflow: "hidden",
              transition: "background 0.2s",
            }}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: "100%",
                background: "none",
                border: "none",
                padding: "20px 24px",
                textAlign: "left",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
              }}
            >
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: open === i ? "#F0EEE7" : "#C0BEB8",
                  lineHeight: 1.4,
                }}
              >
                {faq.q}
              </span>
              <span
                style={{
                  color: "#00E5FF",
                  fontSize: 20,
                  fontWeight: 400,
                  flexShrink: 0,
                  transition: "transform 0.2s",
                  transform: open === i ? "rotate(45deg)" : "none",
                  lineHeight: 1,
                }}
              >
                +
              </span>
            </button>

            {open === i && (
              <div style={{ padding: "0 24px 20px" }}>
                <p
                  style={{
                    color: "#8A8A9B",
                    fontSize: 14,
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {faq.a}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
