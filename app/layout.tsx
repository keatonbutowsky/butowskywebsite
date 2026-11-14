import type { Metadata } from "next";
import { Inter, Overpass, Overpass_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const overpass = Overpass({
  subsets: ["latin"],
  variable: "--font-overpass",
});

const overpassMono = Overpass_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-mono",
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
    <html
      lang="en"
      className={`${inter.variable} ${overpass.variable} ${overpassMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
