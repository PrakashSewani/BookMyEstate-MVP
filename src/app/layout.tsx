import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Book My Estate",
  description: "Discover your perfect property through an immersive experience",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BookMyEstate",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0a1929",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-brand-950 text-white">
        {children}
      </body>
    </html>
  );
}
