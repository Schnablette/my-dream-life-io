"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calculator } from "@/components/calculator"
import Image from "next/image"

export default function Home() {
  const [showCalculator, setShowCalculator] = useState(false)

  if (showCalculator) {
    return <Calculator onBack={() => setShowCalculator(false)} />
  }

  return (
    <div className="min-h-screen bg-[#f5e6e0]">
      <header className="border-b border-[#e8c4ba] bg-[#f5d4cc] px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-2xl font-bold text-[#d4758b]">MyDreamLife.io</h1>
          <Button
            variant="outline"
            className="border-[#d4758b] bg-transparent text-[#d4758b] hover:bg-[#d4758b] hover:text-white"
            onClick={() => setShowCalculator(true)}
          >
            Free Lifestyle Calculator
          </Button>
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-12 flex justify-center">
            <Image src="/logo.png" alt="MyDreamLife.io" width={100} height={100} />
          </div>

          <h2 className="mb-4 text-balance text-5xl font-bold leading-tight text-foreground">
            Budget? I don&apos;t even know it!
          </h2>
          <p className="mb-12 text-pretty text-xl text-muted-foreground">Calculate your dream lifestyle salary</p>

          <Button
            size="lg"
            className="bg-[#d4758b] px-8 py-6 text-lg font-semibold text-white hover:bg-[#c26577]"
            onClick={() => setShowCalculator(true)}
          >
            Free Lifestyle Calculator
          </Button>
        </div>
      </main>
    </div>
  )
}
