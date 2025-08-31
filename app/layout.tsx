import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Montserrat, Open_Sans } from "next/font/google"
import { Suspense } from "react"
import AuthProvider from "@/components/xploraa/auth-provider"
import { Toaster } from "sonner"

export const metadata: Metadata = {
  title: "Xploraa",
  description: "Gamified city exploration",
  generator: "v0.app",
}

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  display: "swap",
  variable: "--font-montserrat",
})
const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${openSans.variable} ${montserrat.variable} antialiased`}>
      <body className="font-sans">
        <AuthProvider>
          <Suspense fallback={null}>{children}</Suspense>
          <Toaster richColors position="top-right" />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
