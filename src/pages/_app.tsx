import '@/src/styles/globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { PageLayout } from '@/components/page-layout'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <PageLayout>
        <Component {...pageProps} />
      </PageLayout>
    </ThemeProvider>
  )
}

