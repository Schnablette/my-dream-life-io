import LZString from "lz-string"

const expenses = [
  { id: "1",  name: "Rent",              amount: 2500, frequency: "month" },
  { id: "2",  name: "Groceries",         amount: 600,  frequency: "month" },
  { id: "3",  name: "Electricity",       amount: 120,  frequency: "month" },
  { id: "4",  name: "Internet",          amount: 80,   frequency: "month" },
  { id: "5",  name: "Phone",             amount: 60,   frequency: "month" },
  { id: "6",  name: "Health Insurance",  amount: 400,  frequency: "month" },
  { id: "7",  name: "Gym",               amount: 50,   frequency: "month" },
  { id: "8",  name: "Streaming",         amount: 45,   frequency: "month" },
  { id: "9",  name: "Dining Out",        amount: 300,  frequency: "month" },
  { id: "10", name: "Coffee",            amount: 80,   frequency: "month" },
  { id: "11", name: "Clothing",          amount: 150,  frequency: "month" },
  { id: "12", name: "Haircut",           amount: 50,   frequency: "month" },
  { id: "13", name: "Car Insurance",     amount: 200,  frequency: "month" },
  { id: "14", name: "Gas",               amount: 120,  frequency: "month" },
  { id: "15", name: "Car Maintenance",   amount: 100,  frequency: "month" },
  { id: "16", name: "Parking",           amount: 75,   frequency: "month" },
  { id: "17", name: "Flights",           amount: 2000, frequency: "year"  },
  { id: "18", name: "Hotels",            amount: 1500, frequency: "year"  },
  { id: "19", name: "Books",             amount: 30,   frequency: "month" },
  { id: "20", name: "Software Subs",     amount: 40,   frequency: "month" },
  { id: "21", name: "Charity",           amount: 100,  frequency: "month" },
  { id: "22", name: "Pet Food",          amount: 80,   frequency: "month" },
  { id: "23", name: "Vet Bills",         amount: 600,  frequency: "year"  },
  { id: "24", name: "Home Supplies",     amount: 60,   frequency: "month" },
  { id: "25", name: "Miscellaneous",     amount: 200,  frequency: "month" },
]

const events = [
  {
    id: "e1",
    name: "Buy a Car",
    category: "purchase",
    impacts: [{
      type: "add_loan",
      purchase: { price: 35000, loanTermMonths: 60, annualInterestRate: 7 },
    }],
  },
  {
    id: "e2",
    name: "New Laptop",
    category: "purchase",
    impacts: [{
      type: "add_cash_purchase",
      purchase: { price: 2500, spreadMonths: 12 },
    }],
  },
  {
    id: "e3",
    name: "Home Down Payment",
    category: "purchase",
    impacts: [{
      type: "add_cash_purchase",
      purchase: { price: 60000, spreadMonths: 36 },
    }],
  },
]

const state = { expenses, events, taxRate: 25, savingsRate: 20 }
const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(state))
const url = `http://localhost:3000/calculator?d=${compressed}`

console.log("\nTest URL (25 expenses + 3 big purchases):")
console.log(url)
console.log(`\nURL length: ${url.length} characters`)
