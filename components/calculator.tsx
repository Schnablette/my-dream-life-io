"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Pencil, Trash2, GripVertical, RotateCcw, Download } from "lucide-react"

type Frequency = "year" | "month" | "week" | "day"

interface Expense {
  id: string
  name: string
  amount: number
  frequency: Frequency
}

export function Calculator() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [newExpenseName, setNewExpenseName] = useState("")
  const [newExpenseAmount, setNewExpenseAmount] = useState("")
  const [newExpenseFrequency, setNewExpenseFrequency] = useState<Frequency>("year")
  const [taxRate, setTaxRate] = useState(25)
  const [savingsRate, setSavingsRate] = useState(20)
  const [editingId, setEditingId] = useState<string | null>(null)

  const frequencyMultipliers: Record<Frequency, number> = {
    year: 1,
    month: 12,
    week: 52,
    day: 365,
  }

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

  const addExpense = () => {
    if (newExpenseName.trim() && newExpenseAmount) {
      const amount = Number.parseFloat(newExpenseAmount)
      if (!isNaN(amount) && amount > 0) {
        setExpenses([
          ...expenses,
          {
            id: Date.now().toString(),
            name: newExpenseName.trim(),
            amount,
            frequency: newExpenseFrequency,
          },
        ])
        setNewExpenseName("")
        setNewExpenseAmount("")
        setNewExpenseFrequency("year")
      }
    }
  }

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id))
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatFrequency = (frequency: Frequency) => {
    const map = { year: "yr", month: "mo", week: "wk", day: "day" }
    return map[frequency]
  }

  const reset = () => {
    setExpenses([])
    setTaxRate(25)
    setSavingsRate(20)
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Lifestyle Calculator</h1>
            <p className="text-muted-foreground">
              Enter expenses and reverse calculate the salary needed to cover them
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={reset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr,1.2fr]">
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-foreground">Lifestyle</h2>

              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-[1fr,auto]">
                  <div>
                    <Label htmlFor="expense-name" className="text-foreground">
                      Name
                    </Label>
                    <Input
                      id="expense-name"
                      placeholder="Desired Expense"
                      value={newExpenseName}
                      onChange={(e) => setNewExpenseName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addExpense()}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expense-cost" className="text-foreground">
                      Cost
                    </Label>
                    <div className="mt-1 flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id="expense-cost"
                          type="number"
                          placeholder="100"
                          value={newExpenseAmount}
                          onChange={(e) => setNewExpenseAmount(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && addExpense()}
                          className="pl-7"
                        />
                      </div>
                      <Select
                        value={newExpenseFrequency}
                        onValueChange={(value) => setNewExpenseFrequency(value as Frequency)}
                      >
                        <SelectTrigger className="w-[100px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="year">/yr</SelectItem>
                          <SelectItem value="month">/mo</SelectItem>
                          <SelectItem value="week">/wk</SelectItem>
                          <SelectItem value="day">/day</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-primary text-foreground hover:bg-[#c26577]" onClick={addExpense}>
                  Add Expense Item
                </Button>
              </div>

              {expenses.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-3 font-semibold text-foreground">Expense Items</h3>
                  <div className="space-y-2">
                    {expenses.map((expense) => (
                      <div
                        key={expense.id}
                        className="flex items-center gap-2 rounded-md border border-border bg-muted/30 p-3"
                      >
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <span className="flex-1 text-sm text-foreground">{expense.name}</span>
                        <span className="text-sm font-medium text-foreground">
                          {formatCurrency(expense.amount)}/{formatFrequency(expense.frequency)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setEditingId(expense.id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => deleteExpense(expense.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg bg-white p-8 shadow-sm">
              <h2 className="mb-2 text-lg font-semibold text-foreground">Annual Salary</h2>
              <p className="text-5xl font-bold text-foreground">{formatCurrency(annualSalary)}</p>
            </div>

            <div className="rounded-lg bg-white p-8 shadow-sm">
              <h2 className="mb-2 text-lg font-semibold text-foreground">Monthly Salary</h2>
              <p className="text-5xl font-bold text-foreground">{formatCurrency(monthlySalary)}</p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="space-y-6">
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <Label className="text-base font-semibold text-foreground">Average Tax Rate - {taxRate}%</Label>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">0%</span>
                    <Slider
                      value={[taxRate]}
                      onValueChange={(value) => setTaxRate(value[0])}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground">100%</span>
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <Label className="text-base font-semibold text-foreground">
                      Average Savings Rate - {savingsRate}%
                    </Label>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">0%</span>
                    <Slider
                      value={[savingsRate]}
                      onValueChange={(value) => setSavingsRate(value[0])}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground">100%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}
