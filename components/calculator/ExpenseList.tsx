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
  return (
    <div className="mt-6">
      <h3 className="mb-3 font-semibold text-foreground">Expense Items</h3>
      {expenses.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border py-10 text-center text-muted-foreground">
          <p className="text-sm font-medium">No expenses yet</p>
          <p className="mt-1 text-sm">Add an expense above to calculate your salary</p>
        </div>
      )}
      <div className="space-y-2">
        {expenses.map((expense) => (
          <ul
            key={expense.id} 
          >
            <li className="flex items-center gap-2 rounded-md border border-border bg-white px-3 py-1">
              <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
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
                className="h-8 w-8 hover:text-destructive"
                onClick={() => onDelete(expense.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          </ul>
        ))}
      </div>
    </div>
  )
}

