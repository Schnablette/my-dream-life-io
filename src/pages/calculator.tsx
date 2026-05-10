import { Calculator } from "@/components/calculator"
import Head from "next/head"

const SITE_URL = "https://www.mydreamlife.io"

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Reverse Budget Calculator",
  url: `${SITE_URL}/calculator`,
  description:
    "A free reverse budget calculator that works out the salary you need to afford your desired lifestyle. Enter your expenses, set your tax and savings rates, and get your number.",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
}

export default function CalculatorPage() {
  const title = "Reverse Budget Calculator — Find Your Dream Lifestyle Salary | MyDreamLife.io"
  const description =
    "Stop budgeting backwards. Enter the lifestyle you want, and the free reverse budget calculator tells you exactly what salary you need to earn to afford it."

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
        <meta property="og:image" content={`${SITE_URL}/pig.svg`} />

        {/* Twitter */}
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${SITE_URL}/pig.svg`} />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <Calculator />
    </>
  )
}

