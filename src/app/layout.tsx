import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { TempoInit } from "@/components/tempo-init";
import { ThemeProvider } from "@/components/theme-provider";
import dynamic from "next/dynamic";

// Dynamically import AdminPanel with SSR disabled to prevent hydration issues
const AdminPanel = dynamic(() => import("@/components/admin/admin-panel"), {
  ssr: false,
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VAI Health - AI-Enabled Healthcare Platform",
  description:
    "Connect with AI-assisted medical consultations and real doctors through our secure, HIPAA-compliant platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Script src="https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js" />
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <AdminPanel />
        </ThemeProvider>
        <TempoInit />
      </body>
    </html>
  );
}
