"use client"

import { Button } from "@/components/ui/button"
import { RotateCcw, Download, Share2 } from "lucide-react"

interface CalculatorHeaderProps {
  onReset: () => void
  onDownload: () => void
  onShare: () => void
  shareState: "idle" | "loading" | "copied" | "error"
}

export function CalculatorHeader({ onReset, onDownload, onShare, shareState }: CalculatorHeaderProps) {
  return (
    <div className="mb-6 flex items-start justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reverse Budget Calculator</h1>
        <p className="text-muted-foreground">
          Enter expenses to reverse calculate the salary needed to cover them
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onReset}>
          <RotateCcw className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Reset</span>
        </Button>
        <Button variant="outline" size="sm" onClick={onDownload}>
          <Download className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Download</span>
        </Button>
        <Button variant="outline" size="sm" onClick={onShare} disabled={shareState === "loading"}>
          <Share2 className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">
            {shareState === "loading" ? "Sharing…" : shareState === "copied" ? "Copied!" : shareState === "error" ? "Error" : "Share"}
          </span>
        </Button>
      </div>
    </div>
  )
}

