import type React from "react"
import { Analytics } from "@vercel/analytics/next"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      {children}
      <Analytics />
    </>
  )
}
