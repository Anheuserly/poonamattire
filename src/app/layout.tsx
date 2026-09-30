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
    default: "Poonam Attire | Luxury Indian Ethnic Wear & Designer Dresses",
    template: "%s | Poonam Attire",
  },
  description:
    "Explore luxury handcrafted Indian ethnic wear — festive salwar suits, pure Chanderi kurtas, Banarasi silk lehengas, and everyday handloom cottons with nationwide delivery.",
  keywords: [
    "Poonam Attire",
    "Ethnic Wear",
    "Salwar Suits",
    "Chanderi Kurta",
    "Banarasi Lehenga",
    "Designer Indian Dresses",
    "Anarkali Suits",
    "Festive Wear",
    "Handloom Cotton",
  ],
  authors: [{ name: "Poonam Attire Boutique" }],
  creator: "Poonam Attire",
  publisher: "Poonam Attire",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Poonam Attire | Luxury Indian Ethnic Wear & Designer Dresses",
    description:
      "Handcrafted ethnic wear celebrating timeless Indian weaves, zari motifs, and contemporary festive silhouettes.",
    url: "https://poonamattire.com",
    siteName: "Poonam Attire",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1594226801341-41427b4e5c22?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Poonam Attire Festive Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Poonam Attire | Luxury Indian Ethnic Wear",
    description: "Handcrafted salwar suits, pure Chanderi kurtas, and luxury Indian ensembles.",
    images: ["https://images.unsplash.com/photo-1594226801341-41427b4e5c22?auto=format&fit=crop&w=1200&q=80"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://poonamattire.com/#organization",
      "name": "Poonam Attire",
      "url": "https://poonamattire.com",
      "logo": "https://poonamattire.com/poonam-attire-logo.jpg",
      "sameAs": [
        "https://www.youtube.com/@PoonamsAttire06",
        "https://www.instagram.com/poonamsattire06/",
        "https://www.facebook.com/poonamsattire06/"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-98100-12345",
        "contactType": "customer service",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi"],
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://poonamattire.com/#website",
      "url": "https://poonamattire.com",
      "name": "Poonam Attire",
      "description": "Premium salwar suits, Chanderi kurtas, and luxury Indian ethnic wear.",
      "publisher": { "@id": "https://poonamattire.com/#organization" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://poonamattire.com/shop?search={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        <Navbar />
        {children}
        <Footer />
        <AppShell />
      </body>
    </html>
  );
}
