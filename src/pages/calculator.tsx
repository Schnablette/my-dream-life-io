import { Calculator } from "@/components/calculator"
import Head from "next/head"

export default function CalculatorPage() {
  return (<>
    <Head>
      <title>MyDreamLife.io - Lifestyle Salary Calculator</title>
      <meta name="description" content="Calculate the salary needed to afford your dream lifestyle" />
    </Head>
    <Calculator />
  </>)
}

