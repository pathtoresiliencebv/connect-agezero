import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Agezero Connect",
  description:
    "Agezero Connect — your dashboard for AI-powered integrations.",
  applicationName: "Agezero Connect",
};

export const viewport: Viewport = {
  themeColor: "#06070a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}