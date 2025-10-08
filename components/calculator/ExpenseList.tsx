"use client"

import { Button } from "@/components/ui/button"
import { Pencil, Trash2, GripVertical } from "lucide-react"
import type { Expense } from "./types"
import { formatCurrency, formatFrequency } from "./types"

interface ExpenseListProps {
  expenses: Expense[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function ExpenseList({ expenses, onEdit, onDelete }: ExpenseListProps) {
  if (expenses.length === 0) {
    return null
  }

  return (
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
              onClick={() => onEdit(expense.id)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onDelete(expense.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

