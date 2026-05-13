import { describe, it, expect } from "vitest"
import { frequencyMultipliers, calculateEventAnnualImpact, type Expense, type LifeEvent } from "../../components/calculator/types"

// Mirrors the calculateAnnualSalary logic in Calculator.tsx
function calculateAnnualSalary(
  expenses: Expense[],
  events: LifeEvent[],
  taxRate: number,
  savingsRate: number
): number {
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

function makeExpense(overrides: Partial<Expense> = {}): Expense {
  return {
    id: "1",
    name: "Test Expense",
    amount: 1000,
    frequency: "year",
    ...overrides,
  }
}

// ─── Zero state ───────────────────────────────────────────────────────────────

describe("calculateAnnualSalary — zero state", () => {
  it("no expenses, no events, any rates → $0 salary", () => {
    expect(calculateAnnualSalary([], [], 25, 20)).toBe(0)
    expect(calculateAnnualSalary([], [], 0, 0)).toBe(0)
    expect(calculateAnnualSalary([], [], 50, 50)).toBe(0)
  })
})

// ─── Rate effects ─────────────────────────────────────────────────────────────

describe("calculateAnnualSalary — rate effects", () => {
  it("0% tax, 0% savings: salary equals total expenses", () => {
    const expenses = [makeExpense({ amount: 60000, frequency: "year" })]
    expect(calculateAnnualSalary(expenses, [], 0, 0)).toBeCloseTo(60000, 2)
  })

  it("25% tax, 20% savings, $60k expenses → $100k salary", () => {
    // 60000 / (0.75 * 0.80) = 60000 / 0.60 = 100000
    const expenses = [makeExpense({ amount: 60000, frequency: "year" })]
    expect(calculateAnnualSalary(expenses, [], 25, 20)).toBeCloseTo(100000, 2)
  })

  it("50% tax, 0% savings, $50k expenses → $100k salary", () => {
    const expenses = [makeExpense({ amount: 50000, frequency: "year" })]
    expect(calculateAnnualSalary(expenses, [], 50, 0)).toBeCloseTo(100000, 2)
  })

  it("0% tax, 50% savings, $30k expenses → $60k salary", () => {
    const expenses = [makeExpense({ amount: 30000, frequency: "year" })]
    expect(calculateAnnualSalary(expenses, [], 0, 50)).toBeCloseTo(60000, 2)
  })

  it("higher rates require higher salary for the same expenses", () => {
    const expenses = [makeExpense({ amount: 48000, frequency: "year" })]
    const lowRate = calculateAnnualSalary(expenses, [], 10, 10)
    const highRate = calculateAnnualSalary(expenses, [], 40, 30)
    expect(highRate).toBeGreaterThan(lowRate)
  })
})

// ─── Frequency conversions ───────────────────────────────────────────────────

describe("calculateAnnualSalary — expense frequency annualization", () => {
  it("monthly $1000 expense counts as $12000/year", () => {
    const expenses = [makeExpense({ amount: 1000, frequency: "month" })]
    expect(calculateAnnualSalary(expenses, [], 0, 0)).toBeCloseTo(12000, 2)
  })

  it("weekly $100 expense counts as $5200/year", () => {
    const expenses = [makeExpense({ amount: 100, frequency: "week" })]
    expect(calculateAnnualSalary(expenses, [], 0, 0)).toBeCloseTo(5200, 2)
  })

  it("daily $10 expense counts as $3650/year", () => {
    const expenses = [makeExpense({ amount: 10, frequency: "day" })]
    expect(calculateAnnualSalary(expenses, [], 0, 0)).toBeCloseTo(3650, 2)
  })

  it("yearly $24000 expense treated as exactly $24000/year", () => {
    const expenses = [makeExpense({ amount: 24000, frequency: "year" })]
    expect(calculateAnnualSalary(expenses, [], 0, 0)).toBeCloseTo(24000, 2)
  })
})

// ─── Multiple expenses ────────────────────────────────────────────────────────

describe("calculateAnnualSalary — multiple expenses", () => {
  it("accumulates all expenses before applying rates", () => {
    const expenses: Expense[] = [
      makeExpense({ id: "1", amount: 12000, frequency: "year" }),  // 12000
      makeExpense({ id: "2", amount: 1000, frequency: "month" }),  // 12000
    ]
    // total = 24000, at 0% rates → salary = 24000
    expect(calculateAnnualSalary(expenses, [], 0, 0)).toBeCloseTo(24000, 2)
  })
})

// ─── Events ───────────────────────────────────────────────────────────────────

describe("calculateAnnualSalary — events", () => {
  it("loan event adds to required salary", () => {
    const events: LifeEvent[] = [
      {
        id: "e1",
        name: "Car",
        category: "purchase",
        impacts: [
          { type: "add_loan", purchase: { price: 12000, annualInterestRate: 0, loanTermMonths: 12 } },
        ],
      },
    ]
    // 12000/year event at 0% rates → salary = 12000
    expect(calculateAnnualSalary([], events, 0, 0)).toBeCloseTo(12000, 2)
  })

  it("income_change event reduces required salary", () => {
    const expenses = [makeExpense({ amount: 60000, frequency: "year" })]
    const events: LifeEvent[] = [
      {
        id: "e1",
        name: "Side income",
        category: "income",
        impacts: [{ type: "income_change", annualAmount: 10000 }],
      },
    ]
    // net need = 60000 - 10000 = 50000, at 0% rates → salary = 50000
    expect(calculateAnnualSalary(expenses, events, 0, 0)).toBeCloseTo(50000, 2)
  })

  it("expenses and events combine before applying tax/savings rates", () => {
    const expenses = [makeExpense({ amount: 30000, frequency: "year" })]
    const events: LifeEvent[] = [
      {
        id: "e1",
        name: "House",
        category: "purchase",
        impacts: [
          { type: "add_cash_purchase", purchase: { price: 12000, spreadMonths: 12 } }, // 12000/year
        ],
      },
    ]
    // total = 42000, at 25% tax + 20% savings → 42000 / 0.60 = 70000
    expect(calculateAnnualSalary(expenses, events, 25, 20)).toBeCloseTo(70000, 2)
  })

  it("multiple events accumulate correctly", () => {
    const events: LifeEvent[] = [
      {
        id: "e1",
        name: "Car",
        category: "purchase",
        impacts: [{ type: "add_cash_purchase", purchase: { price: 12000, spreadMonths: 12 } }],
      },
      {
        id: "e2",
        name: "Vacation",
        category: "purchase",
        impacts: [{ type: "add_expense", expense: { name: "Vacation", amount: 3000, frequency: "year" } }],
      },
    ]
    // 12000 + 3000 = 15000 at 0% → 15000
    expect(calculateAnnualSalary([], events, 0, 0)).toBeCloseTo(15000, 2)
  })
})

// ─── Monthly salary derivation ────────────────────────────────────────────────

describe("monthly salary derivation", () => {
  it("monthly salary is annual divided by 12", () => {
    const expenses = [makeExpense({ amount: 60000, frequency: "year" })]
    const annual = calculateAnnualSalary(expenses, [], 25, 20) // 100000
    const monthly = annual / 12
    expect(monthly).toBeCloseTo(100000 / 12, 2)
  })
})

// ─── Default rates ────────────────────────────────────────────────────────────

describe("default rates (25% tax, 20% savings)", () => {
  it("matches the formula with the app's default rates", () => {
    const expenses = [makeExpense({ amount: 4800, frequency: "month" })] // 57600/year
    // 57600 / (0.75 * 0.80) = 57600 / 0.60 = 96000
    expect(calculateAnnualSalary(expenses, [], 25, 20)).toBeCloseTo(96000, 2)
  })
})
