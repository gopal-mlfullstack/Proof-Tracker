import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Proof Tracker - Build Your Discipline",
  description:
    "Track your discipline. Build your legacy. Prove yourself daily.",
  authors: [{ name: "Gopal" }],
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🏆</text></svg>',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className="antialiased">{children}</body>
    </html>
  );
}
