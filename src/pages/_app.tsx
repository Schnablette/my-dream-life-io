import '@/src/styles/globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { PageLayout } from '@/components/page-layout'
import type { AppProps } from 'next/app'
import { Suspense } from 'react'
import RootLayout from "@/components/layout"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RootLayout>
      <ThemeProvider>
        <PageLayout>
          <Component {...pageProps} />
        </PageLayout>
      </ThemeProvider>
    </RootLayout>
  )
}

