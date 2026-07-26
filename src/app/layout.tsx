import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BHAVYA — Video Editor & Motion Designer",
  description: "I make videos that stop the scroll, tell stories, and grow brands.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
