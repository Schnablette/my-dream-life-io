"use client"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface RatesSettingsProps {
  taxRate: number
  savingsRate: number
  onTaxRateChange: (rate: number) => void
  onSavingsRateChange: (rate: number) => void
}

export function RatesSettings({ taxRate, savingsRate, onTaxRateChange, onSavingsRateChange }: RatesSettingsProps) {
  return (
      <div className="space-y-6">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <Label className="text-base font-semibold text-foreground">Average Tax Rate - {taxRate}%</Label>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">0%</span>
            <Slider
              value={[taxRate]}
              onValueChange={(value) => onTaxRateChange(value[0])}
              max={99}
              step={1}
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground">100%</span>
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <Label className="text-base font-semibold text-foreground">
              Average Savings Rate - {savingsRate}%
            </Label>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">0%</span>
            <Slider
              value={[savingsRate]}
              onValueChange={(value) => onSavingsRateChange(value[0])}
              max={99}
              step={1}
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground">100%</span>
          </div>
        </div>

        <div className="border-t border-border pt-6 space-y-2">
          <h2 className="text-sm font-semibold text-foreground">What is a reverse budget?</h2>
          <p className="text-sm text-muted-foreground">
            A traditional budget starts with your income and figures out what's left over. A reverse budget works the
            other way. You decide what you want your life to look like, add up what it costs, and use that number to set
            your income goal. It turns budgeting from a ceiling into a floor.
          </p>
        </div>
      </div>
  )
}

