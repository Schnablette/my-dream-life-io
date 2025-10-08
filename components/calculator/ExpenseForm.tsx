"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Frequency } from "./types"

interface ExpenseFormProps {
  onAddExpense: (name: string, amount: number, frequency: Frequency) => void
}

export function ExpenseForm({ onAddExpense }: ExpenseFormProps) {
  const [newExpenseName, setNewExpenseName] = useState("")
  const [newExpenseAmount, setNewExpenseAmount] = useState("")
  const [newExpenseFrequency, setNewExpenseFrequency] = useState<Frequency>("year")

  const handleAddExpense = () => {
    if (newExpenseName.trim() && newExpenseAmount) {
      const amount = Number.parseFloat(newExpenseAmount)
      if (!isNaN(amount) && amount > 0) {
        onAddExpense(newExpenseName.trim(), amount, newExpenseFrequency)
        setNewExpenseName("")
        setNewExpenseAmount("")
        setNewExpenseFrequency("year")
      }
    }
  }

  return (
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
            onKeyDown={(e) => e.key === "Enter" && handleAddExpense()}
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
                placeholder="0"
                value={newExpenseAmount}
                onChange={(e) => setNewExpenseAmount(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddExpense()}
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

      <Button className="w-full bg-primary text-foreground hover:bg-primary-hover" onClick={handleAddExpense}>
        Add Expense Item
      </Button>
    </div>
  )
}

