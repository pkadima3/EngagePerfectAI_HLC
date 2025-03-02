// INCORRECT - Client component that modifies head
'use client'

import Head from 'next/head' // This import shouldn't be used in App Router

function MyComponent() {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Component content */}
    </>
  )
}

// CORRECT - Keep head-related content in Server Components via metadata

// INCORRECT - Template literals with whitespace
export const metadata = {
  title: 'EngagePerfect AI',
}