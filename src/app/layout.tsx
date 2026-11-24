import type { Metadata } from "next";
// Self-hosted fonts: the build no longer downloads from Google Fonts, whose
// "/l/font?kit=" URLs break Turbopack's next/font/google loader on Vercel.
import "@fontsource-variable/geist/wght.css";
import "./globals.css";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";

export const metadata: Metadata = {
  title: "Accurate Trade Links (ATL) | Enterprise Solutions",
  description: "Precision Weighing, Billing & Industrial Automation Solutions. Trusted by businesses, industries, laboratories, healthcare institutions and government organizations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`font-sans antialiased min-h-screen bg-background text-foreground flex flex-col`}
      >
        {children}
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
