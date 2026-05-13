import { describe, it, expect } from "vitest"
import LZString from "lz-string"
import type { Expense, LifeEvent } from "../../components/calculator/types"

function buildShareUrl(
  origin: string,
  expenses: Expense[],
  events: LifeEvent[],
  taxRate: number,
  savingsRate: number
): string {
  const state = { expenses, events, taxRate, savingsRate }
  const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(state))
  return `${origin}/calculator?d=${compressed}`
}

function parseShareUrl(url: string) {
  const d = new URL(url).searchParams.get("d")
  if (!d) throw new Error("No d param in URL")
  const decompressed = LZString.decompressFromEncodedURIComponent(d)
  return JSON.parse(decompressed)
}

const ORIGIN = "https://www.mydreamlife.io"

// ─── Empty state ──────────────────────────────────────────────────────────────

describe("share link — empty state", () => {
  it("round-trips empty expenses and events", () => {
    const url = buildShareUrl(ORIGIN, [], [], 25, 20)
    const parsed = parseShareUrl(url)
    expect(parsed.expenses).toEqual([])
    expect(parsed.events).toEqual([])
    expect(parsed.taxRate).toBe(25)
    expect(parsed.savingsRate).toBe(20)
  })

  it("round-trips zero tax and savings rates", () => {
    const url = buildShareUrl(ORIGIN, [], [], 0, 0)
    const parsed = parseShareUrl(url)
    expect(parsed.taxRate).toBe(0)
    expect(parsed.savingsRate).toBe(0)
  })

  it("round-trips max rates (99%)", () => {
    const url = buildShareUrl(ORIGIN, [], [], 99, 99)
    const parsed = parseShareUrl(url)
    expect(parsed.taxRate).toBe(99)
    expect(parsed.savingsRate).toBe(99)
  })
})

// ─── All frequency types ──────────────────────────────────────────────────────

describe("share link — all expense frequencies survive round-trip", () => {
  const frequencies = ["year", "month", "week", "day"] as const

  for (const frequency of frequencies) {
    it(`frequency "${frequency}" is preserved`, () => {
      const expenses: Expense[] = [{ id: "1", name: "Test", amount: 100, frequency }]
      const url = buildShareUrl(ORIGIN, expenses, [], 25, 20)
      const parsed = parseShareUrl(url)
      expect(parsed.expenses[0].frequency).toBe(frequency)
    })
  }
})

// ─── All event impact types ────────────────────────────────────────────────────

describe("share link — all event impact types survive round-trip", () => {
  it("add_loan impact", () => {
    const events: LifeEvent[] = [
      {
        id: "ev1",
        name: "Car loan",
        category: "purchase",
        impacts: [
          { type: "add_loan", purchase: { price: 25000, annualInterestRate: 5.5, loanTermMonths: 60 } },
        ],
      },
    ]
    const url = buildShareUrl(ORIGIN, [], events, 25, 20)
    const parsed = parseShareUrl(url)
    expect(parsed.events[0].impacts[0]).toEqual(events[0].impacts[0])
  })

  it("add_cash_purchase impact", () => {
    const events: LifeEvent[] = [
      {
        id: "ev2",
        name: "Emergency fund",
        category: "custom",
        impacts: [
          { type: "add_cash_purchase", purchase: { price: 10000, spreadMonths: 24 } },
        ],
      },
    ]
    const url = buildShareUrl(ORIGIN, [], events, 25, 20)
    const parsed = parseShareUrl(url)
    expect(parsed.events[0].impacts[0]).toEqual(events[0].impacts[0])
  })

  it("add_expense impact inside event", () => {
    const events: LifeEvent[] = [
      {
        id: "ev3",
        name: "New pet",
        category: "custom",
        impacts: [
          { type: "add_expense", expense: { name: "Pet food", amount: 80, frequency: "month" } },
        ],
      },
    ]
    const url = buildShareUrl(ORIGIN, [], events, 25, 20)
    const parsed = parseShareUrl(url)
    expect(parsed.events[0].impacts[0]).toEqual(events[0].impacts[0])
  })

  it("income_change impact", () => {
    const events: LifeEvent[] = [
      {
        id: "ev4",
        name: "Rental income",
        category: "income",
        impacts: [{ type: "income_change", annualAmount: 18000 }],
      },
    ]
    const url = buildShareUrl(ORIGIN, [], events, 25, 20)
    const parsed = parseShareUrl(url)
    expect(parsed.events[0].impacts[0]).toEqual(events[0].impacts[0])
  })

  it("event with multiple impacts of different types", () => {
    const events: LifeEvent[] = [
      {
        id: "ev5",
        name: "New home",
        category: "purchase",
        impacts: [
          { type: "add_loan", purchase: { price: 400000, annualInterestRate: 7, loanTermMonths: 360 } },
          { type: "add_expense", expense: { name: "HOA", amount: 300, frequency: "month" } },
        ],
      },
    ]
    const url = buildShareUrl(ORIGIN, [], events, 25, 20)
    const parsed = parseShareUrl(url)
    expect(parsed.events[0].impacts).toHaveLength(2)
    expect(parsed.events[0].impacts[0]).toEqual(events[0].impacts[0])
    expect(parsed.events[0].impacts[1]).toEqual(events[0].impacts[1])
  })
})

// ─── Large numbers ────────────────────────────────────────────────────────────

describe("share link — large and precise numbers", () => {
  it("handles very large expense amounts", () => {
    const expenses: Expense[] = [{ id: "1", name: "Jet", amount: 1_000_000, frequency: "year" }]
    const url = buildShareUrl(ORIGIN, expenses, [], 25, 20)
    const parsed = parseShareUrl(url)
    expect(parsed.expenses[0].amount).toBe(1_000_000)
  })

  it("preserves decimal precision in interest rates", () => {
    const events: LifeEvent[] = [
      {
        id: "e1",
        name: "Mortgage",
        category: "purchase",
        impacts: [
          { type: "add_loan", purchase: { price: 500000, annualInterestRate: 6.875, loanTermMonths: 360 } },
        ],
      },
    ]
    const url = buildShareUrl(ORIGIN, [], events, 25, 20)
    const parsed = parseShareUrl(url)
    expect(parsed.events[0].impacts[0].purchase.annualInterestRate).toBe(6.875)
  })
})

// ─── Special characters in names ─────────────────────────────────────────────

describe("share link — special characters in names", () => {
  it("preserves ampersands and punctuation in expense names", () => {
    const expenses: Expense[] = [
      { id: "1", name: "Food & Drink (weekdays)", amount: 50, frequency: "day" },
    ]
    const url = buildShareUrl(ORIGIN, expenses, [], 25, 20)
    const parsed = parseShareUrl(url)
    expect(parsed.expenses[0].name).toBe("Food & Drink (weekdays)")
  })

  it("preserves unicode characters in names", () => {
    const expenses: Expense[] = [
      { id: "1", name: "Café ☕ subscription", amount: 25, frequency: "month" },
    ]
    const url = buildShareUrl(ORIGIN, expenses, [], 25, 20)
    const parsed = parseShareUrl(url)
    expect(parsed.expenses[0].name).toBe("Café ☕ subscription")
  })
})

// ─── URL structure ────────────────────────────────────────────────────────────

describe("share link — URL structure", () => {
  it("URL contains only the d query parameter with no extra characters", () => {
    const url = buildShareUrl(ORIGIN, [], [], 25, 20)
    const parsed = new URL(url)
    expect(parsed.pathname).toBe("/calculator")
    expect([...parsed.searchParams.keys()]).toEqual(["d"])
  })

  it("d parameter is a non-empty string", () => {
    const url = buildShareUrl(ORIGIN, [], [], 25, 20)
    const d = new URL(url).searchParams.get("d")
    expect(typeof d).toBe("string")
    expect(d!.length).toBeGreaterThan(0)
  })

  it("different states produce different d values", () => {
    const url1 = buildShareUrl(ORIGIN, [{ id: "1", name: "A", amount: 100, frequency: "month" }], [], 25, 20)
    const url2 = buildShareUrl(ORIGIN, [{ id: "1", name: "A", amount: 200, frequency: "month" }], [], 25, 20)
    const d1 = new URL(url1).searchParams.get("d")
    const d2 = new URL(url2).searchParams.get("d")
    expect(d1).not.toBe(d2)
  })

  it("same state always produces the same d value (deterministic)", () => {
    const expenses: Expense[] = [{ id: "1", name: "Rent", amount: 2000, frequency: "month" }]
    const url1 = buildShareUrl(ORIGIN, expenses, [], 25, 20)
    const url2 = buildShareUrl(ORIGIN, expenses, [], 25, 20)
    expect(url1).toBe(url2)
  })
})
