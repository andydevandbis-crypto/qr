import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QRGenerator - Free QR Code Generator",
  description: "Generate QR codes instantly in your browser. Free and no registration required.",
  keywords: [
    "QR code generator",
    "free QR code",
    "create QR code",
    "QR generator",
    "Wi-Fi QR",
    "vCard QR",
    "QR code free",
    "generador de cÃ³digo QR",
    "gÃ©nÃ©rateur de code QR",
    "QR-Code-Generator",
    "generatore di codici QR",
    "gerador de cÃ³digo QR",
    "QR-code generator",
    "darmowy generator kodÃ³w QR",
    "Ð³ÐµÐ½ÐµÑ€Ð°Ñ‚Ð¾Ñ€ QR-ÐºÐ¾Ð´Ð¾Ð²",
    "QRã‚³ãƒ¼ãƒ‰ç”Ÿæˆ",
    "äºŒç»´ç ç”Ÿæˆå™¨",
    "Ù…ÙˆÙ„Ø¯ Ø±Ù…Ø² QR",
  ],
  openGraph: {
    title: "QRGenerator - Free QR Code Generator",
    description: "Create QR codes instantly in your browser. Free and no registration required.",
    url: "https://qr-two-flax.vercel.app/",
    siteName: "QRGenerator",
    images: [
      {
        url: "https://qr-two-flax.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "QRGenerator - Free QR Code Generator",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QRGenerator - Free QR Code Generator",
    description: "Create QR codes instantly in your browser. Free and no registration required.",
    images: ["https://qr-two-flax.vercel.app/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
