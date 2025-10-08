"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/router"

export function Navbar() {
  const router = useRouter()

  return (
    <header className="py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <h1 
          className="text-2xl text-muted-foreground cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => router.push("/")}
        >
          MyDreamLife.io
        </h1>
        <Button
          variant="outline"
          className="border-primary bg-primary-light text-foreground hover:bg-primary hover:text-foreground"
          onClick={() => router.push("/calculator")}
        >
          Free Lifestyle Calculator
        </Button>
      </div>
    </header>
  )
}

