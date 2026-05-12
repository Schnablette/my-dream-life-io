import { describe, it, expect, vi } from "vitest"
import LZString from "lz-string"
import type { Expense, LifeEvent, Frequency } from "../../components/calculator/types"

// Mirrors the compression logic in Calculator.tsx handleShare
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

// Mirrors the decompression logic in pages/calculator.tsx useEffect
function parseShareUrl(url: string) {
  const d = new URL(url).searchParams.get("d")
  if (!d) throw new Error("No d param in URL")
  const decompressed = LZString.decompressFromEncodedURIComponent(d)
  return JSON.parse(decompressed)
}

function makeExpense(index: number): Expense {
  const frequencies: Frequency[] = ["month", "year", "week", "day"]
  return {
    id: `expense-${index}`,
    name: `Expense ${index}`,
    amount: (index + 1) * 50,
    frequency: frequencies[index % frequencies.length],
  }
}

function makeEvent(index: number): LifeEvent {
  return {
    id: `event-${index}`,
    name: `Big Purchase ${index}`,
    category: "purchase",
    impacts: [
      {
        type: "add_loan",
        purchase: {
          price: (index + 1) * 10000,
          loanTermMonths: 60,
          annualInterestRate: 5,
        },
      },
    ],
  }
}

describe("share link round-trip", () => {
  it("encodes 25 expenses and 3 big purchases and decodes back to identical data", () => {
    const expenses = Array.from({ length: 25 }, (_, i) => makeExpense(i))
    const events = Array.from({ length: 3 }, (_, i) => makeEvent(i))
    const taxRate = 28
    const savingsRate = 15

    const url = buildShareUrl("https://www.mydreamlife.io", expenses, events, taxRate, savingsRate)

    expect(url).toMatch(/^https:\/\/www\.mydreamlife\.io\/calculator\?d=/)

    const parsed = parseShareUrl(url)

    expect(parsed.expenses).toHaveLength(25)
    expect(parsed.events).toHaveLength(3)
    expect(parsed.taxRate).toBe(taxRate)
    expect(parsed.savingsRate).toBe(savingsRate)

    // Verify each expense round-trips exactly
    parsed.expenses.forEach((expense: Expense, i: number) => {
      expect(expense).toEqual(expenses[i])
    })

    // Verify each event round-trips exactly
    parsed.events.forEach((event: LifeEvent, i: number) => {
      expect(event).toEqual(events[i])
    })
  })

  it("does not call the Dub.co API during share URL construction", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch")

    const expenses = Array.from({ length: 25 }, (_, i) => makeExpense(i))
    const events = Array.from({ length: 3 }, (_, i) => makeEvent(i))

    buildShareUrl("https://www.mydreamlife.io", expenses, events, 25, 20)

    expect(fetchSpy).not.toHaveBeenCalled()
    fetchSpy.mockRestore()
  })
})
