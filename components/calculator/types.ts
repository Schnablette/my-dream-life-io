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

