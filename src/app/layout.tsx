import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://poonamattire.com"),
  title: {
    default: "Poonam Attire - Elegant Women's Ethnic Wear",
    template: "%s | Poonam Attire",
  },
  description:
    "Shop premium salwar suits for every occasion. Traditional elegance meets modern style.",
  openGraph: {
    title: "Poonam Attire",
    description:
      "Premium salwar suits, festive sets, and everyday ethnic wear for modern Indian women.",
    siteName: "Poonam Attire",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <Navbar />
        {children}
        <Footer />
        <AppShell />
      </body>
    </html>
  );
}
