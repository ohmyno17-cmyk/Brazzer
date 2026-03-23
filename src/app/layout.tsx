import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#f97316",
};

export const metadata: Metadata = {
  title: "BRAZER Browser - Browse Freely",
  description: "Browse freely. No limits. No tracking. Unrestricted web browser with auto-delete history for maximum privacy.",
  keywords: ["browser", "privacy", "freedom", "unrestricted", "no tracking", "auto delete", "web browser"],
  authors: [{ name: "BRAZER" }],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BRAZER",
  },
  openGraph: {
    title: "BRAZER Browser",
    description: "Browse freely. No limits. No tracking.",
    type: "website",
    images: [{ url: "/icons/icon-512x512.png", width: 512, height: 512 }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-gray-950 text-white`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
