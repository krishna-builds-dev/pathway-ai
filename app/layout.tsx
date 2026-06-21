import "./globals.css";
import { Geist, Inter } from "next/font/google";
import "react-toastify/dist/ReactToastify.css";
import { getUser } from "@/lib/supabase/auth";
import { AuthProvider } from "@/components/providers/AuthProvider";
import ScrollProgressBar from "@/components/providers/ScrollProgressBar";
import LayoutSelector from "@/components/layout/LayoutSelector";
import ToastProvider from "@/components/providers/ToastProvider";  // ✅ add this
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"


const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-geist",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <html lang="en" className={`${geist.variable} ${inter.variable}`}>
      <head>
        <meta name="apple-mobile-web-app-title" content="Pathway" />
      </head>
      <body>
        <ScrollProgressBar />
        <AuthProvider initialUser={user}>
          <ToastProvider />    {/* ✅ responsive toast provider */}
          <LayoutSelector>{children}</LayoutSelector>
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}