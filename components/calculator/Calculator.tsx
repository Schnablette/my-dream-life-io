"use client"

import { useState, useRef } from "react"
import { toPng } from "html-to-image"
import type { Expense, Frequency } from "./types"
import { frequencyMultipliers } from "./types"
import { CalculatorHeader } from "./CalculatorHeader"
import { ExpenseForm } from "./ExpenseForm"
import { ExpenseList } from "./ExpenseList"
import { SalaryResults } from "./SalaryResults"
import { RatesSettings } from "./RatesSettings"

export function Calculator() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [taxRate, setTaxRate] = useState(25)
  const [savingsRate, setSavingsRate] = useState(20)
  const [editingId, setEditingId] = useState<string | null>(null)
  const calculatorRef = useRef<HTMLDivElement>(null)

  const calculateAnnualSalary = () => {
    const totalAnnualExpenses = expenses.reduce((sum, expense) => {
      return sum + expense.amount * frequencyMultipliers[expense.frequency]
    }, 0)

    const taxDecimal = taxRate / 100
    const savingsDecimal = savingsRate / 100

    return totalAnnualExpenses / ((1 - taxDecimal) * (1 - savingsDecimal))
  }

  const annualSalary = calculateAnnualSalary()
  const monthlySalary = annualSalary / 12

  const addExpense = (name: string, amount: number, frequency: Frequency) => {
    setExpenses([
      ...expenses,
      {
        id: Date.now().toString(),
        name,
        amount,
        frequency,
      },
    ])
  }

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id))
  }

  const reset = () => {
    setExpenses([])
    setTaxRate(25)
    setSavingsRate(20)
  }

  const handleDownload = async () => {
    if (!calculatorRef.current) return

    try {
      const dataUrl = await toPng(calculatorRef.current, {
        cacheBust: true,
        backgroundColor: "#FDF4F2",
        pixelRatio: 2, // Higher quality (2x resolution)
        style: {
          transform: "scale(1)",
          transformOrigin: "center",
        },
      })

      // Create download link
      const link = document.createElement("a")
      link.download = `lifestyle-calculator-${new Date().toISOString().split("T")[0]}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error("Error capturing calculator:", error)
    }
  }

  return (
    <div ref={calculatorRef}>
      <div className="mx-auto max-w-6xl py-6">
        <CalculatorHeader onReset={reset} onDownload={handleDownload} />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <h2 className="mb-4 text-xl font-semibold text-foreground">Lifestyle</h2>
            <ExpenseForm onAddExpense={addExpense} />
            <ExpenseList expenses={expenses} onEdit={setEditingId} onDelete={deleteExpense} />
          </div>

          <div className="space-y-6">
            <SalaryResults annualSalary={annualSalary} monthlySalary={monthlySalary} />
            <RatesSettings
              taxRate={taxRate}
              savingsRate={savingsRate}
              onTaxRateChange={setTaxRate}
              onSavingsRateChange={setSavingsRate}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

