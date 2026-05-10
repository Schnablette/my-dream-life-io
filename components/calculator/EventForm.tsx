"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  type LifeEvent,
  type EventCategory,
  LOAN_TERM_OPTIONS,
  calculateMonthlyPayment,
  formatCurrency,
} from "./types"

interface EventFormProps {
  onAddEvent: (event: LifeEvent) => void
}

interface ValidationErrors {
  name?: string
  price?: string
  interestRate?: string
}

const CATEGORY_LABELS: Record<EventCategory, string> = {
  purchase: "Purchase",
  income: "Income Change",
  job: "Job Change",
  custom: "Custom",
}

export function EventForm({ onAddEvent }: EventFormProps) {
  const [name, setName] = useState("")
  const [category, setCategory] = useState<EventCategory>("purchase")
  const [price, setPrice] = useState("")
  const [loanTermMonths, setLoanTermMonths] = useState(60)
  const [annualInterestRate, setAnnualInterestRate] = useState("7")
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState({ name: false, price: false, interestRate: false })

  const previewMonthly =
    price && !isNaN(Number(price)) && Number(price) > 0
      ? calculateMonthlyPayment(Number(price), Number(annualInterestRate) || 0, loanTermMonths)
      : null

  const validateName = (v: string) => {
    if (!v.trim()) return "Name is required"
    if (v.trim().length < 2) return "Name must be at least 2 characters"
    if (v.trim().length > 50) return "Name must be less than 50 characters"
  }

  const validatePrice = (v: string) => {
    if (!v) return "Price is required"
    const n = Number(v)
    if (isNaN(n) || n <= 0) return "Price must be greater than 0"
    if (n > 1_000_000_000) return "Price must be less than $1,000,000,000"
  }

  const validateInterestRate = (v: string) => {
    const n = Number(v)
    if (isNaN(n) || n < 0) return "Interest rate must be 0 or greater"
    if (n > 100) return "Interest rate must be less than 100%"
  }

  const handleSubmit = () => {
    setTouched({ name: true, price: true, interestRate: true })

    const nameError = validateName(name)
    const priceError = category === "purchase" ? validatePrice(price) : undefined
    const interestRateError = category === "purchase" ? validateInterestRate(annualInterestRate) : undefined

    setErrors({ name: nameError, price: priceError, interestRate: interestRateError })
    if (nameError || priceError || interestRateError) return

    const event: LifeEvent = {
      id: Date.now().toString(),
      name: name.trim(),
      category,
      impacts:
        category === "purchase"
          ? [
              {
                type: "add_loan",
                purchase: {
                  price: Number(price),
                  loanTermMonths,
                  annualInterestRate: Number(annualInterestRate) || 0,
                },
              },
            ]
          : [],
    }

    onAddEvent(event)
    setName("")
    setPrice("")
    setLoanTermMonths(60)
    setAnnualInterestRate("7")
    setErrors({})
    setTouched({ name: false, price: false, interestRate: false })
  }

  return (
    <div className="space-y-4">
      {/* Name + Category row */}
      <div className="grid gap-4 sm:grid-cols-[1fr,auto]">
        <div>
          <Label htmlFor="event-name" className="text-foreground">
            Name
          </Label>
          <Input
            id="event-name"
            placeholder="e.g. Buy a car"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (touched.name) setErrors((prev) => ({ ...prev, name: validateName(e.target.value) }))
            }}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, name: true }))
              setErrors((prev) => ({ ...prev, name: validateName(name) }))
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className={`mt-1 ${errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>

        <div>
          <Label className="text-foreground">Category</Label>
          <Select value={category} onValueChange={(v) => setCategory(v as EventCategory)}>
            <SelectTrigger className="mt-1 w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(CATEGORY_LABELS) as EventCategory[]).map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {CATEGORY_LABELS[cat]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Purchase-specific fields */}
      {category === "purchase" && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="event-price" className="text-foreground">
              Price
            </Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="event-price"
                type="number"
                placeholder="0"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value)
                  if (touched.price) setErrors((prev) => ({ ...prev, price: validatePrice(e.target.value) }))
                }}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, price: true }))
                  setErrors((prev) => ({ ...prev, price: validatePrice(price) }))
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className={`pl-7 ${errors.price ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
            </div>
            {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
          </div>

          <div>
            <Label className="text-foreground">Loan Term</Label>
            <Select
              value={String(loanTermMonths)}
              onValueChange={(v) => setLoanTermMonths(Number(v))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LOAN_TERM_OPTIONS.map((opt) => (
                  <SelectItem key={opt.months} value={String(opt.months)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="event-rate" className="text-foreground">
              Interest Rate
            </Label>
            <div className="relative mt-1">
              <Input
                id="event-rate"
                type="number"
                placeholder="7"
                value={annualInterestRate}
                onChange={(e) => {
                  setAnnualInterestRate(e.target.value)
                  if (touched.interestRate)
                    setErrors((prev) => ({ ...prev, interestRate: validateInterestRate(e.target.value) }))
                }}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, interestRate: true }))
                  setErrors((prev) => ({ ...prev, interestRate: validateInterestRate(annualInterestRate) }))
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className={`pr-7 ${errors.interestRate ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
            </div>
            {errors.interestRate && <p className="mt-1 text-sm text-red-500">{errors.interestRate}</p>}
          </div>
        </div>
      )}

      {/* Monthly payment preview */}
      {category === "purchase" && previewMonthly !== null && (
        <p className="text-sm text-muted-foreground">
          Monthly payment: <span className="font-medium text-foreground">{formatCurrency(previewMonthly)}/mo</span>
        </p>
      )}

      <Button className="w-full bg-primary text-foreground hover:bg-primary-hover" onClick={handleSubmit}>
        Add Life Event
      </Button>
    </div>
  )
}
