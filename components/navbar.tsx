"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/router"

export function Navbar() {
  const router = useRouter()

  return (
    <header className="py-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <span
          className="text-sm text-muted-foreground cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => router.push("/")}
        >
          MyDreamLife.io
        </span>
      </div>
    </header>
  )
}

