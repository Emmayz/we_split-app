"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#how-it-works", label: "How it works" },
    { href: "#features", label: "Features" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: "background 0.2s, border-color 0.2s",
        backgroundColor: scrolled ? "rgba(11,11,20,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid #1F1F2D" : "1px solid transparent",
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 28, color: "#00E5FF", fontWeight: 700, lineHeight: 1 }}>÷</span>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#F0EEE7" }}>wesplit</span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="hide-mobile">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              style={{
                color: "#8A8A9B",
                textDecoration: "none",
                fontSize: 15,
                fontWeight: 500,
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#F0EEE7")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#8A8A9B")}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a
            href="#get-started"
            style={{
              backgroundColor: "#00E5FF",
              color: "#0B0B14",
              padding: "8px 20px",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "none",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Get the app
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              color: "#F0EEE7",
              display: "none",
            }}
            className="show-mobile"
            aria-label="Toggle menu"
          >
            <div style={{ width: 22, display: "flex", flexDirection: "column", gap: 5 }}>
              <span style={{ height: 2, background: "#F0EEE7", borderRadius: 2, display: "block", transition: "transform 0.2s", transform: menuOpen ? "rotate(45deg) translateY(7px)" : "none" }} />
              <span style={{ height: 2, background: "#F0EEE7", borderRadius: 2, display: "block", opacity: menuOpen ? 0 : 1, transition: "opacity 0.2s" }} />
              <span style={{ height: 2, background: "#F0EEE7", borderRadius: 2, display: "block", transition: "transform 0.2s", transform: menuOpen ? "rotate(-45deg) translateY(-7px)" : "none" }} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            backgroundColor: "#14141F",
            borderTop: "1px solid #1F1F2D",
            padding: "16px 24px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{ color: "#F0EEE7", textDecoration: "none", fontSize: 16, fontWeight: 500 }}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
        @media (min-width: 641px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
