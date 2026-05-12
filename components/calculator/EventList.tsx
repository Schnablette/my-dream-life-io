"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import type { LifeEvent } from "./types"
import { calculateMonthlyPayment, formatCurrency } from "./types"

interface EventListProps {
  events: LifeEvent[]
  onDelete: (id: string) => void
}

function getMonthlyImpact(event: LifeEvent): number {
  return event.impacts.reduce((sum, impact) => {
    if (impact.type === "add_loan") {
      return (
        sum +
        calculateMonthlyPayment(
          impact.purchase.price,
          impact.purchase.annualInterestRate,
          impact.purchase.loanTermMonths
        )
      )
    }
    if (impact.type === "add_cash_purchase") {
      return sum + impact.purchase.price / impact.purchase.spreadMonths
    }
    if (impact.type === "add_expense") {
      const multipliers = { year: 1 / 12, month: 1, week: 52 / 12, day: 365 / 12 }
      return sum + impact.expense.amount * multipliers[impact.expense.frequency]
    }
    if (impact.type === "income_change") {
      return sum - impact.annualAmount / 12
    }
    return sum
  }, 0)
}

function getImpactBadge(event: LifeEvent): string {
  const type = event.impacts[0]?.type
  if (type === "add_loan") return "Loan"
  if (type === "add_cash_purchase") return "Cash"
  return "Event"
}

export function EventList({ events, onDelete }: EventListProps) {
  return (
    <div className="mt-6">
{events.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border py-10 text-center text-muted-foreground">
          <p className="text-sm font-medium">No purchases yet</p>
          <p className="mt-1 text-sm">Add a big purchase above to see its monthly cost</p>
        </div>
      )}
      <div className="space-y-2">
        {events.map((event) => {
          const monthly = getMonthlyImpact(event)
          return (
            <div
              key={event.id}
              className="flex items-center gap-2 rounded-md border border-border bg-white px-3 py-1"
            >
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {getImpactBadge(event)}
              </span>
              <span className="flex-1 text-sm text-foreground">{event.name}</span>
              <span className="text-sm font-medium text-foreground">
                {formatCurrency(monthly)}/mo
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:text-destructive"
                onClick={() => onDelete(event.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
