export type Frequency = "year" | "month" | "week" | "day"

export interface Expense {
  id: string
  name: string
  amount: number
  frequency: Frequency
}

export const frequencyMultipliers: Record<Frequency, number> = {
  year: 1,
  month: 12,
  week: 52,
  day: 365,
}

// --- Life Events ---

export interface Purchase {
  price: number
  loanTermMonths: number
  annualInterestRate: number
}

export interface CashPurchase {
  price: number
  spreadMonths: number
}

export type EventImpact =
  | { type: "add_expense"; expense: Omit<Expense, "id"> }
  | { type: "add_loan"; purchase: Purchase }
  | { type: "add_cash_purchase"; purchase: CashPurchase }
  | { type: "income_change"; annualAmount: number }

export type EventCategory = "purchase" | "income" | "job" | "custom"

export interface LifeEvent {
  id: string
  name: string
  category: EventCategory
  impacts: EventImpact[]
}

export const LOAN_TERM_OPTIONS = [
  { label: "1 year", months: 12 },
  { label: "2 years", months: 24 },
  { label: "3 years", months: 36 },
  { label: "5 years", months: 60 },
  { label: "10 years", months: 120 },
  { label: "15 years", months: 180 },
  { label: "20 years", months: 240 },
  { label: "30 years", months: 360 },
]

export function calculateMonthlyPayment(
  price: number,
  annualInterestRate: number,
  termMonths: number
): number {
  if (annualInterestRate === 0) return price / termMonths
  const r = annualInterestRate / 100 / 12
  return (price * r) / (1 - Math.pow(1 + r, -termMonths))
}

export function calculateEventAnnualImpact(impacts: EventImpact[]): number {
  return impacts.reduce((sum, impact) => {
    if (impact.type === "add_expense") {
      return sum + impact.expense.amount * frequencyMultipliers[impact.expense.frequency]
    }
    if (impact.type === "add_loan") {
      const monthly = calculateMonthlyPayment(
        impact.purchase.price,
        impact.purchase.annualInterestRate,
        impact.purchase.loanTermMonths
      )
      return sum + monthly * 12
    }
    if (impact.type === "add_cash_purchase") {
      return sum + (impact.purchase.price / impact.purchase.spreadMonths) * 12
    }
    if (impact.type === "income_change") {
      return sum - impact.annualAmount
    }
    return sum
  }, 0)
}

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export const formatFrequency = (frequency: Frequency) => {
  const map = { year: "yr", month: "mo", week: "wk", day: "day" }
  return map[frequency]
}

