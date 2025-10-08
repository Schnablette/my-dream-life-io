import type React from "react"
import { Navbar } from "@/components/navbar"
import Link from "next/link"

interface PageLayoutProps {
  children: React.ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-primary-light px-6 flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="flex justify-between items-center gap-2 px-2 py-2">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} MyDreamLife.io</p>
        <p className="py-2 text-sm text-muted-foreground flex items-center justify-center gap-2">
          Made with love by <Link href={"https://www.linkedin.com/in/annschandez/"} target="_blank" className="text-primary underline hover:text-primary-hover">Ann Schandez</Link>
        </p>
      </footer>
    </div>
  )
}

