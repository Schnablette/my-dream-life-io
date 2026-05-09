import type { GetServerSideProps } from "next"

// Stub homepage — redirects to the calculator for now.
// Replace getServerSideProps with a real page when you're ready to build
// a multi-tool landing page that links out to the calculator and other features.
export default function Home() {
  return null
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/calculator",
      permanent: true,
    },
  }
}
