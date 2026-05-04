import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { AuthProvider, useAuth } from "@/lib/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AMS - UCEK",
  description: "Academic Management System for University College of Engineering, Kariavattom",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AMS",
    startupImage: [
  {
    "url": "/icons/apple-splash-1125-2436.jpg",
    "media": "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
  },
  {
    "url": "/icons/apple-splash-1136-640.jpg",
    "media": "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
  },
  {
    "url": "/icons/apple-splash-1170-2532.jpg",
    "media": "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
  },
  {
    "url": "/icons/apple-splash-1179-2556.jpg",
    "media": "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
  },
  {
    "url": "/icons/apple-splash-1206-2622.jpg",
    "media": "(device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
  },
  {
    "url": "/icons/apple-splash-1242-2208.jpg",
    "media": "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
  },
  {
    "url": "/icons/apple-splash-1242-2688.jpg",
    "media": "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
  },
  {
    "url": "/icons/apple-splash-1260-2736.jpg",
    "media": "(device-width: 420px) and (device-height: 912px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
  },
  {
    "url": "/icons/apple-splash-1284-2778.jpg",
    "media": "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
  },
  {
    "url": "/icons/apple-splash-1290-2796.jpg",
    "media": "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
  },
  {
    "url": "/icons/apple-splash-1320-2868.jpg",
    "media": "(device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
  },
  {
    "url": "/icons/apple-splash-1334-750.jpg",
    "media": "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
  },
  {
    "url": "/icons/apple-splash-1488-2266.jpg",
    "media": "(device-width: 496px) and (device-height: 755px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
  },
  {
    "url": "/icons/apple-splash-1536-2048.jpg",
    "media": "(device-width: 512px) and (device-height: 683px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
  },
  {
    "url": "/icons/apple-splash-1620-2160.jpg",
    "media": "(device-width: 540px) and (device-height: 720px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
  },
  {
    "url": "/icons/apple-splash-1640-2360.jpg",
    "media": "(device-width: 547px) and (device-height: 787px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
  },
  {
    "url": "/icons/apple-splash-1668-2224.jpg",
    "media": "(device-width: 556px) and (device-height: 741px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
  },
  {
    "url": "/icons/apple-splash-1668-2388.jpg",
    "media": "(device-width: 556px) and (device-height: 796px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
  },
  {
    "url": "/icons/apple-splash-1792-828.jpg",
    "media": "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
  },
  {
    "url": "/icons/apple-splash-2048-1536.jpg",
    "media": "(device-width: 512px) and (device-height: 683px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
  },
  {
    "url": "/icons/apple-splash-2048-2732.jpg",
    "media": "(device-width: 683px) and (device-height: 911px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
  },
  {
    "url": "/icons/apple-splash-2160-1620.jpg",
    "media": "(device-width: 540px) and (device-height: 720px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
  },
  {
    "url": "/icons/apple-splash-2208-1242.jpg",
    "media": "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
  },
  {
    "url": "/icons/apple-splash-2224-1668.jpg",
    "media": "(device-width: 556px) and (device-height: 741px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
  },
  {
    "url": "/icons/apple-splash-2266-1488.jpg",
    "media": "(device-width: 496px) and (device-height: 755px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
  },
  {
    "url": "/icons/apple-splash-2360-1640.jpg",
    "media": "(device-width: 547px) and (device-height: 787px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
  },
  {
    "url": "/icons/apple-splash-2388-1668.jpg",
    "media": "(device-width: 556px) and (device-height: 796px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
  },
  {
    "url": "/icons/apple-splash-2436-1125.jpg",
    "media": "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
  },
  {
    "url": "/icons/apple-splash-2532-1170.jpg",
    "media": "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
  },
  {
    "url": "/icons/apple-splash-2556-1179.jpg",
    "media": "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
  },
  {
    "url": "/icons/apple-splash-2622-1206.jpg",
    "media": "(device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
  },
  {
    "url": "/icons/apple-splash-2688-1242.jpg",
    "media": "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
  },
  {
    "url": "/icons/apple-splash-2732-2048.jpg",
    "media": "(device-width: 683px) and (device-height: 911px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
  },
  {
    "url": "/icons/apple-splash-2736-1260.jpg",
    "media": "(device-width: 420px) and (device-height: 912px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
  },
  {
    "url": "/icons/apple-splash-2778-1284.jpg",
    "media": "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
  },
  {
    "url": "/icons/apple-splash-2796-1290.jpg",
    "media": "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
  },
  {
    "url": "/icons/apple-splash-2868-1320.jpg",
    "media": "(device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
  },
  {
    "url": "/icons/apple-splash-640-1136.jpg",
    "media": "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
  },
  {
    "url": "/icons/apple-splash-750-1334.jpg",
    "media": "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
  },
  {
    "url": "/icons/apple-splash-828-1792.jpg",
    "media": "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
  }
],
  },
  formatDetection: { telephone: false },
  icons: {
    apple: "/icons/apple-icon-180.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}