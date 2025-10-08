"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Frequency, Expense } from "./types"

interface ExpenseFormProps {
  onAddExpense: (name: string, amount: number, frequency: Frequency) => void
  onUpdateExpense?: (id: string, name: string, amount: number, frequency: Frequency) => void
  editingExpense?: Expense
  onCancelEdit?: () => void
}

interface ValidationErrors {
  name?: string
  amount?: string
}

export function ExpenseForm({ onAddExpense, onUpdateExpense, editingExpense, onCancelEdit }: ExpenseFormProps) {
  const [newExpenseName, setNewExpenseName] = useState("")
  const [newExpenseAmount, setNewExpenseAmount] = useState("")
  const [newExpenseFrequency, setNewExpenseFrequency] = useState<Frequency>("year")
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState({ name: false, amount: false })

  // Populate form when editing
  useEffect(() => {
    if (editingExpense) {
      setNewExpenseName(editingExpense.name)
      setNewExpenseAmount(editingExpense.amount.toString())
      setNewExpenseFrequency(editingExpense.frequency)
      setErrors({})
      setTouched({ name: false, amount: false })
    }
  }, [editingExpense])

  const validateName = (name: string): string | undefined => {
    if (!name.trim()) {
      return "Expense name is required"
    }
    if (name.trim().length < 2) {
      return "Expense name must be at least 2 characters"
    }
    if (name.trim().length > 50) {
      return "Expense name must be less than 50 characters"
    }
    return undefined
  }

  const validateAmount = (amount: string): string | undefined => {
    if (!amount) {
      return "Amount is required"
    }
    const numAmount = Number.parseFloat(amount)
    if (isNaN(numAmount)) {
      return "Amount must be a valid number"
    }
    if (numAmount <= 0) {
      return "Amount must be greater than 0"
    }
    if (numAmount > 1000000000) {
      return "Amount must be less than $1,000,000,000"
    }
    return undefined
  }

  const handleNameChange = (value: string) => {
    setNewExpenseName(value)
    if (touched.name) {
      const error = validateName(value)
      setErrors(prev => ({ ...prev, name: error }))
    }
  }

  const handleAmountChange = (value: string) => {
    setNewExpenseAmount(value)
    if (touched.amount) {
      const error = validateAmount(value)
      setErrors(prev => ({ ...prev, amount: error }))
    }
  }

  const handleNameBlur = () => {
    setTouched(prev => ({ ...prev, name: true }))
    const error = validateName(newExpenseName)
    setErrors(prev => ({ ...prev, name: error }))
  }

  const handleAmountBlur = () => {
    setTouched(prev => ({ ...prev, amount: true }))
    const error = validateAmount(newExpenseAmount)
    setErrors(prev => ({ ...prev, amount: error }))
  }

  const handleSubmit = () => {
    // Mark all fields as touched
    setTouched({ name: true, amount: true })

    // Validate all fields
    const nameError = validateName(newExpenseName)
    const amountError = validateAmount(newExpenseAmount)
    
    setErrors({
      name: nameError,
      amount: amountError,
    })

    // If no errors, add or update the expense
    if (!nameError && !amountError) {
      const amount = Number.parseFloat(newExpenseAmount)
      
      if (editingExpense && onUpdateExpense) {
        onUpdateExpense(editingExpense.id, newExpenseName.trim(), amount, newExpenseFrequency)
      } else {
        onAddExpense(newExpenseName.trim(), amount, newExpenseFrequency)
      }
      
      // Reset form
      setNewExpenseName("")
      setNewExpenseAmount("")
      setNewExpenseFrequency("year")
      setErrors({})
      setTouched({ name: false, amount: false })
    }
  }

  const handleCancel = () => {
    setNewExpenseName("")
    setNewExpenseAmount("")
    setNewExpenseFrequency("year")
    setErrors({})
    setTouched({ name: false, amount: false })
    onCancelEdit?.()
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
            onChange={(e) => handleNameChange(e.target.value)}
            onBlur={handleNameBlur}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className={`mt-1 ${errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "expense-name-error" : undefined}
          />
          {errors.name && (
            <p id="expense-name-error" className="mt-1 text-sm text-red-500">
              {errors.name}
            </p>
          )}
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
                onChange={(e) => handleAmountChange(e.target.value)}
                onBlur={handleAmountBlur}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className={`pl-7 ${errors.amount ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                aria-invalid={!!errors.amount}
                aria-describedby={errors.amount ? "expense-cost-error" : undefined}
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
          {errors.amount && (
            <p id="expense-cost-error" className="mt-1 text-sm text-red-500">
              {errors.amount}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button 
          className="flex-1 bg-primary text-foreground hover:bg-primary-hover" 
          onClick={handleSubmit}
        >
          {editingExpense ? "Update Expense Item" : "Add Expense Item"}
        </Button>
        {editingExpense && (
          <Button 
            variant="outline"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  )
}

