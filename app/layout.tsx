import type React from 'react'
import { headers } from 'next/headers'
import ContextProvider from '@/context'
import './globals.css'

export const metadata = {
  title: "AbrahamNAVIG - ERC20 Token DApp",
  description: "Connect to MetaMask and interact with your ERC20 token on Base Sepolia",
  generator: "v0.dev",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersObj = headers()
  const cookies = headersObj.get('cookie')

  return (
    <html lang="en">
      <body>
        <ContextProvider cookies={cookies}>
          {children}
        </ContextProvider>
      </body>
    </html>
  )
}