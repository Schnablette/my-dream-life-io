"use client"

import { formatCurrency } from "./types"

interface SalaryResultsProps {
  annualSalary: number
  monthlySalary: number
}

export function SalaryResults({ annualSalary, monthlySalary }: SalaryResultsProps) {
  return (
    <div className="space-y-6 ">
      <div className="rounded-lg bg-white p-8 shadow-sm border border-muted">
        <h2 className="mb-2 text-lg font-semibold text-foreground">Annual Salary</h2>
        <p className="text-5xl font-bold text-foreground">{formatCurrency(annualSalary)}</p>
      </div>

      <div className="rounded-lg bg-white p-8 shadow-sm border border-muted">
        <h2 className="mb-2 text-lg font-semibold text-foreground">Monthly Salary</h2>
        <p className="text-5xl font-bold text-foreground">{formatCurrency(monthlySalary)}</p>
      </div>
    </div>
  )
}

