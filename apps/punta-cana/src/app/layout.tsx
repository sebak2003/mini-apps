import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Punta Cana 2026",
  description: "Grand Palladium Select Bavaro - Oct-Nov 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
