"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calculator } from "@/components/calculator"

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
            <svg
              width="200"
              height="140"
              viewBox="0 0 200 140"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#d4758b]"
            >
              <path
                d="M40 100C40 100 50 60 70 40C90 20 110 20 120 30"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="130" cy="70" r="35" stroke="currentColor" strokeWidth="8" fill="none" />
              <circle cx="120" cy="65" r="4" fill="currentColor" />
              <circle cx="140" cy="65" r="4" fill="currentColor" />
              <path
                d="M115 80C115 80 120 85 130 85C140 85 145 80 145 80"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
              <ellipse cx="130" cy="95" rx="15" ry="8" fill="currentColor" opacity="0.3" />
              <rect x="145" y="50" width="8" height="15" rx="4" fill="currentColor" />
            </svg>
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
