import { Button } from "@/components/ui/button"
import Head from "next/head"
import Image from "next/image"
import { useRouter } from "next/router"

export default function Home() {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>MyDreamLife.io</title>
        <meta name="description" content="Why budget when you can just make more money?" />
      </Head>
      <div className="flex min-h-100vh flex-col items-center justify-center px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-12 flex justify-center">
            <Image src="/pig.svg" alt="MyDreamLife.io" width="200" height="200" />
          </div>

          <h2 className="mb-4 text-balance text-3xl font-medium leading-tight text-foreground">
            Budget? I don&apos;t even know it!
          </h2>
          <p className="mb-12 text-pretty text-xl text-muted-foreground">Calculate your dream lifestyle salary</p>

          <Button
            size="lg"
            className="bg-primary px-8 py-6 text-lg font-semibold text-foreground hover:bg-primary-hover"
            onClick={() => router.push("/calculator")}
          >
            Free Lifestyle Calculator
          </Button>
        </div>
      </div>
    </>
  )
}
