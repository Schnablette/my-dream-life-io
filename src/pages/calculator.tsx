import { Calculator } from "@/components/calculator"
import Head from "next/head"

const SITE_URL = "https://www.mydreamlife.io"

export default function CalculatorPage() {
  const title = "Reverse Budget Calculator — Find Your Dream Lifestyle Salary | MyDreamLife.io"
  const description =
    "Stop budgeting backwards. Enter the lifestyle you want, and our free reverse budget calculator tells you exactly what salary you need to earn to afford it."

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`${SITE_URL}/calculator`} />

        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`${SITE_URL}/calculator`} />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Head>
      <Calculator />
    </>
  )
}

