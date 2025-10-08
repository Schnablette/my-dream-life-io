"use client"

import { useState } from "react"
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

  const handleDownload = () => {
    // TODO: Implement download functionality
    console.log("Download functionality to be implemented")
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
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
  )
}

