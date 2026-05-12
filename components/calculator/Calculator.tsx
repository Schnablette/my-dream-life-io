"use client"

import { useState, useRef, useCallback } from "react"
import LZString from "lz-string"
import { toPng } from "html-to-image"
import type { Expense, Frequency, LifeEvent } from "./types"
import { frequencyMultipliers, calculateEventAnnualImpact } from "./types"
import { CalculatorHeader } from "./CalculatorHeader"
import { ExpenseForm } from "./ExpenseForm"
import { ExpenseList } from "./ExpenseList"
import { EventForm } from "./EventForm"
import { EventList } from "./EventList"
import { SalaryResults } from "./SalaryResults"
import { RatesSettings } from "./RatesSettings"

interface CalculatorProps {
  initialState?: {
    expenses: Expense[]
    events: LifeEvent[]
    taxRate: number
    savingsRate: number
  }
}

export function Calculator({ initialState }: CalculatorProps) {
  const [expenses, setExpenses] = useState<Expense[]>(initialState?.expenses ?? [])
  const [events, setEvents] = useState<LifeEvent[]>(initialState?.events ?? [])
  const [taxRate, setTaxRate] = useState(initialState?.taxRate ?? 25)
  const [savingsRate, setSavingsRate] = useState(initialState?.savingsRate ?? 20)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [shareState, setShareState] = useState<"idle" | "loading" | "copied" | "error">("idle")
  const calculatorRef = useRef<HTMLDivElement>(null)

  const calculateAnnualSalary = () => {
    const totalAnnualExpenses = expenses.reduce((sum, expense) => {
      return sum + expense.amount * frequencyMultipliers[expense.frequency]
    }, 0)

    const totalEventImpact = events.reduce((sum, event) => {
      return sum + calculateEventAnnualImpact(event.impacts)
    }, 0)

    const taxDecimal = taxRate / 100
    const savingsDecimal = savingsRate / 100

    return (totalAnnualExpenses + totalEventImpact) / ((1 - taxDecimal) * (1 - savingsDecimal))
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

  const updateExpense = (id: string, name: string, amount: number, frequency: Frequency) => {
    setExpenses(expenses.map((e) => 
      e.id === id ? { ...e, name, amount, frequency } : e
    ))
    setEditingId(null)
  }

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id))
  }

  const handleEdit = (id: string) => {
    setEditingId(id)
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const addEvent = (event: LifeEvent) => {
    setEvents([...events, event])
  }

  const deleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id))
  }

  const reset = () => {
    setExpenses([])
    setEvents([])
    setTaxRate(25)
    setSavingsRate(20)
  }

  const handleShare = useCallback(async () => {
    setShareState("loading")
    try {
      const state = { expenses, events, taxRate, savingsRate }
      const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(state))
      const longUrl = `${window.location.origin}/calculator?d=${compressed}`

      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: longUrl }),
      })

      if (!res.ok) throw new Error("Failed to shorten URL")
      const { shortUrl } = await res.json()
      await navigator.clipboard.writeText(shortUrl)
      setShareState("copied")
      setTimeout(() => setShareState("idle"), 2500)
    } catch {
      setShareState("error")
      setTimeout(() => setShareState("idle"), 2500)
    }
  }, [expenses, events, taxRate, savingsRate])

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
        <CalculatorHeader onReset={reset} onDownload={handleDownload} onShare={handleShare} shareState={shareState} />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 font-semibold text-foreground">Recurring Expenses</h3>
              <ExpenseForm
                onAddExpense={addExpense}
                onUpdateExpense={updateExpense}
                editingExpense={expenses.find((e) => e.id === editingId)}
                onCancelEdit={cancelEdit}
              />
              <ExpenseList expenses={expenses} onEdit={handleEdit} onDelete={deleteExpense} />
            </div>

            <div>
              <h3 className="mb-3 font-semibold text-foreground">Big Purchases</h3>
              <EventForm onAddEvent={addEvent} />
              <EventList events={events} onDelete={deleteEvent} />
            </div>
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

