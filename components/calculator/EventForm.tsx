"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  type LifeEvent,
  LOAN_TERM_OPTIONS,
  calculateMonthlyPayment,
  formatCurrency,
} from "./types"

interface EventFormProps {
  onAddEvent: (event: LifeEvent) => void
}

function LoanForm({ onAddEvent }: EventFormProps) {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [loanTermMonths, setLoanTermMonths] = useState(60)
  const [annualInterestRate, setAnnualInterestRate] = useState("7")
  const [errors, setErrors] = useState<{ name?: string; price?: string; interestRate?: string }>({})
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
    const priceError = validatePrice(price)
    const interestRateError = validateInterestRate(annualInterestRate)
    setErrors({ name: nameError, price: priceError, interestRate: interestRateError })
    if (nameError || priceError || interestRateError) return

    onAddEvent({
      id: Date.now().toString(),
      name: name.trim(),
      category: "purchase",
      impacts: [
        {
          type: "add_loan",
          purchase: {
            price: Number(price),
            loanTermMonths,
            annualInterestRate: Number(annualInterestRate) || 0,
          },
        },
      ],
    })
    setName("")
    setPrice("")
    setLoanTermMonths(60)
    setAnnualInterestRate("7")
    setErrors({})
    setTouched({ name: false, price: false, interestRate: false })
  }

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-foreground">With Loan</h4>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="loan-name" className="text-foreground">Name</Label>
          <Input
            id="loan-name"
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
          <Label htmlFor="loan-price" className="text-foreground">Price</Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input
              id="loan-price"
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
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label className="text-foreground">Loan Term</Label>
          <Select value={String(loanTermMonths)} onValueChange={(v) => setLoanTermMonths(Number(v))}>
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
          <Label htmlFor="loan-rate" className="text-foreground">Interest Rate</Label>
          <div className="relative mt-1">
            <Input
              id="loan-rate"
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
      {previewMonthly !== null && (
        <p className="text-sm text-muted-foreground">
          Monthly payment: <span className="font-medium text-foreground">{formatCurrency(previewMonthly)}/mo</span>
        </p>
      )}
      <Button className="w-full bg-primary text-foreground hover:bg-primary-hover" onClick={handleSubmit}>
        Add Loan Purchase
      </Button>
    </div>
  )
}

function CashForm({ onAddEvent }: EventFormProps) {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [spreadMonths, setSpreadMonths] = useState("12")
  const [errors, setErrors] = useState<{ name?: string; price?: string; spreadMonths?: string }>({})
  const [touched, setTouched] = useState({ name: false, price: false, spreadMonths: false })

  const previewMonthly =
    price && !isNaN(Number(price)) && Number(price) > 0 && Number(spreadMonths) > 0
      ? Number(price) / Number(spreadMonths)
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
  const validateSpreadMonths = (v: string) => {
    const n = Number(v)
    if (!v || isNaN(n) || n < 1) return "Must be at least 1 month"
    if (n > 600) return "Must be 600 months or less"
    if (!Number.isInteger(n)) return "Must be a whole number"
  }

  const handleSubmit = () => {
    setTouched({ name: true, price: true, spreadMonths: true })
    const nameError = validateName(name)
    const priceError = validatePrice(price)
    const spreadError = validateSpreadMonths(spreadMonths)
    setErrors({ name: nameError, price: priceError, spreadMonths: spreadError })
    if (nameError || priceError || spreadError) return

    onAddEvent({
      id: Date.now().toString(),
      name: name.trim(),
      category: "purchase",
      impacts: [
        {
          type: "add_cash_purchase",
          purchase: {
            price: Number(price),
            spreadMonths: Number(spreadMonths),
          },
        },
      ],
    })
    setName("")
    setPrice("")
    setSpreadMonths("12")
    setErrors({})
    setTouched({ name: false, price: false, spreadMonths: false })
  }

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-foreground">Without Loan</h4>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="cash-name" className="text-foreground">Name</Label>
          <Input
            id="cash-name"
            placeholder="e.g. New laptop"
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
          <Label htmlFor="cash-price" className="text-foreground">Price</Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input
              id="cash-price"
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
      </div>
      <div className="sm:w-1/2">
        <Label htmlFor="cash-months" className="text-foreground">Spread Over (months)</Label>
        <Input
          id="cash-months"
          type="number"
          placeholder="12"
          value={spreadMonths}
          onChange={(e) => {
            setSpreadMonths(e.target.value)
            if (touched.spreadMonths) setErrors((prev) => ({ ...prev, spreadMonths: validateSpreadMonths(e.target.value) }))
          }}
          onBlur={() => {
            setTouched((prev) => ({ ...prev, spreadMonths: true }))
            setErrors((prev) => ({ ...prev, spreadMonths: validateSpreadMonths(spreadMonths) }))
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className={`mt-1 ${errors.spreadMonths ? "border-red-500 focus-visible:ring-red-500" : ""}`}
        />
        {errors.spreadMonths && <p className="mt-1 text-sm text-red-500">{errors.spreadMonths}</p>}
      </div>
      {previewMonthly !== null && (
        <p className="text-sm text-muted-foreground">
          Monthly savings needed: <span className="font-medium text-foreground">{formatCurrency(previewMonthly)}/mo</span>
        </p>
      )}
      <Button className="w-full bg-primary text-foreground hover:bg-primary-hover" onClick={handleSubmit}>
        Add Cash Purchase
      </Button>
    </div>
  )
}

export function EventForm({ onAddEvent }: EventFormProps) {
  return (
    <div className="space-y-6">
      <LoanForm onAddEvent={onAddEvent} />
      <div className="border-t border-border" />
      <CashForm onAddEvent={onAddEvent} />
    </div>
  )
}
