"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/router"

export function Navbar() {
  const router = useRouter()

  return (
    <header className="border-b border-[#e8c4ba] bg-[#f5d4cc] px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <h1 
          className="text-2xl font-bold text-[#d4758b] cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => router.push("/")}
        >
          MyDreamLife.io
        </h1>
        <Button
          variant="outline"
          className="border-[#d4758b] bg-transparent text-[#d4758b] hover:bg-[#d4758b] hover:text-white"
          onClick={() => router.push("/calculator")}
        >
          Free Lifestyle Calculator
        </Button>
      </div>
    </header>
  )
}

