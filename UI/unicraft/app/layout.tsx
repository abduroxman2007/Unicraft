import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import "../styles/swiper.css"
import { Providers } from "@/components/providers"
import { Toaster } from "sonner"

export const metadata: Metadata = {
  title: "UNICRAFT PORTAL - Professional Help in Your University Journey",
  description:
    "Find the right mentors to guide you through your academic and professional development with personalized support.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        
      </head>
      <body className="geist-main">
        <Providers>
          {children}
        </Providers>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
