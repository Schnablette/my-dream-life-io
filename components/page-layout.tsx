import type React from "react"
import { Navbar } from "@/components/navbar"

interface PageLayoutProps {
  children: React.ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-primary-light px-6">
      <Navbar />
      <main>{children}</main>
    </div>
  )
}

