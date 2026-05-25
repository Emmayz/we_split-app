import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "wesplit — Pay your share",
  description: "Pay your share of a split bill instantly",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ backgroundColor: "#0B0B14", color: "#F0EEE7", fontFamily: "'Space Grotesk', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
