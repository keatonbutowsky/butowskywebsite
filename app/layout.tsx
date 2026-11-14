import type { Metadata } from "next";
import { Fraunces, Space_Grotesk } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-fraunces",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://butowsky.com"),
  title: "Butowsky",
  description:
    "Investments. Real estate. Artificial intelligence. The personal site of Keaton Butowsky.",
  openGraph: {
    title: "Butowsky",
    description: "Investments. Real estate. Artificial intelligence.",
    url: "https://butowsky.com",
    siteName: "Butowsky",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${grotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
