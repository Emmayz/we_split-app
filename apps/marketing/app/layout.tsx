import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "wesplit — Pay once. Settle in minutes.",
  description:
    "wesplit lets one person pay a bill and get reimbursed by their group. No app needed for guests — just a payment link.",
  openGraph: {
    title: "wesplit — Pay once. Settle in minutes.",
    description:
      "Split bills instantly. No app for guests. Funds straight to your UK bank account.",
    siteName: "wesplit",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      <body>{children}</body>
    </html>
  );
}
