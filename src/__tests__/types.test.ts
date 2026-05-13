import { describe, it, expect } from "vitest"
import {
  frequencyMultipliers,
  calculateMonthlyPayment,
  calculateEventAnnualImpact,
  formatCurrency,
  formatFrequency,
  type EventImpact,
} from "../../components/calculator/types"

// ─── frequencyMultipliers ────────────────────────────────────────────────────

describe("frequencyMultipliers", () => {
  it("year → 1", () => expect(frequencyMultipliers.year).toBe(1))
  it("month → 12", () => expect(frequencyMultipliers.month).toBe(12))
  it("week → 52", () => expect(frequencyMultipliers.week).toBe(52))
  it("day → 365", () => expect(frequencyMultipliers.day).toBe(365))
})

// ─── calculateMonthlyPayment ─────────────────────────────────────────────────

describe("calculateMonthlyPayment", () => {
  it("zero interest: returns price divided by term", () => {
    expect(calculateMonthlyPayment(12000, 0, 12)).toBeCloseTo(1000, 2)
    expect(calculateMonthlyPayment(60000, 0, 60)).toBeCloseTo(1000, 2)
  })

  it("standard car loan: $30k at 6% APR over 60 months", () => {
    // Verified via standard amortization formula: ~$579.98
    const payment = calculateMonthlyPayment(30000, 6, 60)
    expect(payment).toBeCloseTo(579.98, 0)
  })

  it("standard mortgage: $300k at 7% APR over 360 months", () => {
    // Verified result: ~$1995.91
    const payment = calculateMonthlyPayment(300000, 7, 360)
    expect(payment).toBeCloseTo(1995.91, 0)
  })

  it("high interest rate still produces valid positive payment", () => {
    const payment = calculateMonthlyPayment(10000, 24, 12)
    expect(payment).toBeGreaterThan(10000 / 12) // interest pushes payment above principal-only
  })

  it("single month term equals full price plus one month of interest", () => {
    const payment = calculateMonthlyPayment(1200, 12, 1)
    // r = 0.12/12 = 0.01, payment = 1200 * 0.01 / (1 - (1.01)^-1) ≈ 1212
    expect(payment).toBeCloseTo(1212, 0)
  })
})

// ─── calculateEventAnnualImpact ──────────────────────────────────────────────

describe("calculateEventAnnualImpact", () => {
  it("empty impacts array → 0", () => {
    expect(calculateEventAnnualImpact([])).toBe(0)
  })

  it("add_expense monthly $100 → $1200/year", () => {
    const impacts: EventImpact[] = [
      { type: "add_expense", expense: { name: "Netflix", amount: 100, frequency: "month" } },
    ]
    expect(calculateEventAnnualImpact(impacts)).toBe(1200)
  })

  it("add_expense yearly $1000 → $1000/year", () => {
    const impacts: EventImpact[] = [
      { type: "add_expense", expense: { name: "Insurance", amount: 1000, frequency: "year" } },
    ]
    expect(calculateEventAnnualImpact(impacts)).toBe(1000)
  })

  it("add_expense weekly $50 → $2600/year", () => {
    const impacts: EventImpact[] = [
      { type: "add_expense", expense: { name: "Groceries", amount: 50, frequency: "week" } },
    ]
    expect(calculateEventAnnualImpact(impacts)).toBe(2600)
  })

  it("add_expense daily $5 → $1825/year", () => {
    const impacts: EventImpact[] = [
      { type: "add_expense", expense: { name: "Coffee", amount: 5, frequency: "day" } },
    ]
    expect(calculateEventAnnualImpact(impacts)).toBe(1825)
  })

  it("add_loan: annualizes monthly payment", () => {
    const impacts: EventImpact[] = [
      {
        type: "add_loan",
        purchase: { price: 12000, annualInterestRate: 0, loanTermMonths: 12 },
      },
    ]
    // Zero interest: 12000/12 = 1000/mo → 12000/year
    expect(calculateEventAnnualImpact(impacts)).toBeCloseTo(12000, 2)
  })

  it("add_cash_purchase $12000 over 12 months → $12000/year", () => {
    const impacts: EventImpact[] = [
      { type: "add_cash_purchase", purchase: { price: 12000, spreadMonths: 12 } },
    ]
    // (12000/12) * 12 = 12000
    expect(calculateEventAnnualImpact(impacts)).toBeCloseTo(12000, 2)
  })

  it("add_cash_purchase $6000 over 24 months → $3000/year", () => {
    const impacts: EventImpact[] = [
      { type: "add_cash_purchase", purchase: { price: 6000, spreadMonths: 24 } },
    ]
    // (6000/24) * 12 = 3000
    expect(calculateEventAnnualImpact(impacts)).toBeCloseTo(3000, 2)
  })

  it("income_change reduces annual impact", () => {
    const impacts: EventImpact[] = [
      { type: "income_change", annualAmount: 50000 },
    ]
    expect(calculateEventAnnualImpact(impacts)).toBe(-50000)
  })

  it("mixed impacts: expense + loan + income_change net correctly", () => {
    const impacts: EventImpact[] = [
      { type: "add_expense", expense: { name: "Rent", amount: 2000, frequency: "month" } }, // +24000
      { type: "add_loan", purchase: { price: 12000, annualInterestRate: 0, loanTermMonths: 12 } }, // +12000
      { type: "income_change", annualAmount: 10000 }, // -10000
    ]
    expect(calculateEventAnnualImpact(impacts)).toBeCloseTo(26000, 2)
  })

  it("multiple add_expense impacts accumulate", () => {
    const impacts: EventImpact[] = [
      { type: "add_expense", expense: { name: "A", amount: 500, frequency: "year" } },
      { type: "add_expense", expense: { name: "B", amount: 500, frequency: "year" } },
    ]
    expect(calculateEventAnnualImpact(impacts)).toBe(1000)
  })
})

// ─── formatCurrency ──────────────────────────────────────────────────────────

describe("formatCurrency", () => {
  it("formats zero as $0", () => {
    expect(formatCurrency(0)).toBe("$0")
  })

  it("formats whole dollar amounts without cents", () => {
    expect(formatCurrency(1000)).toBe("$1,000")
    expect(formatCurrency(50000)).toBe("$50,000")
  })

  it("rounds fractional cents (no decimal places)", () => {
    expect(formatCurrency(1234.56)).toBe("$1,235")
  })

  it("formats large salaries with commas", () => {
    expect(formatCurrency(100000)).toBe("$100,000")
    expect(formatCurrency(1000000)).toBe("$1,000,000")
  })

  it("formats negative values", () => {
    expect(formatCurrency(-500)).toBe("-$500")
  })
})

// ─── formatFrequency ─────────────────────────────────────────────────────────

describe("formatFrequency", () => {
  it("year → yr", () => expect(formatFrequency("year")).toBe("yr"))
  it("month → mo", () => expect(formatFrequency("month")).toBe("mo"))
  it("week → wk", () => expect(formatFrequency("week")).toBe("wk"))
  it("day → day", () => expect(formatFrequency("day")).toBe("day"))
})
