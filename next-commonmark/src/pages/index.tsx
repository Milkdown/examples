import Head from 'next/head'
import { MilkdownEditor } from '@/components/Editor'
import { MilkdownProvider } from '@milkdown/react'
import { useEffect, useState } from 'react';

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  
  // Wait until after client-side hydration to show
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <MilkdownProvider>
          {isClient && <MilkdownEditor />}
        </MilkdownProvider>
      </main>
    </>
  )
}
