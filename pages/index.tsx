import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRouter } from "next/router"

import Pig from "@/public/pig.svg"

export default function Home() {
  const router = useRouter()

  return (
    <div className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center px-6 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-12 flex justify-center">
          <Image src={Pig} alt="MyDreamLife.io" width={100} height={100} />
        </div>

        <h2 className="mb-4 text-balance text-5xl font-bold leading-tight text-foreground">
          Budget? I don&apos;t even know it!
        </h2>
        <p className="mb-12 text-pretty text-xl text-muted-foreground">Calculate your dream lifestyle salary</p>

        <Button
          size="lg"
          className="bg-[#d4758b] px-8 py-6 text-lg font-semibold text-white hover:bg-[#c26577]"
          onClick={() => router.push("/calculator")}
        >
          Free Lifestyle Calculator
        </Button>
      </div>
    </div>
  )
}
