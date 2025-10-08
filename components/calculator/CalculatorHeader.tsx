"use client"

import { Button } from "@/components/ui/button"
import { RotateCcw, Download } from "lucide-react"

interface CalculatorHeaderProps {
  onReset: () => void
  onDownload: () => void
}

export function CalculatorHeader({ onReset, onDownload }: CalculatorHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-medium text-foreground">Lifestyle Calculator</h1>
        <p className="text-muted-foreground">
          Enter expenses to reverse calculate the salary needed to cover them
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onReset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
        <Button variant="outline" size="sm" onClick={onDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </div>
    </div>
  )
}

