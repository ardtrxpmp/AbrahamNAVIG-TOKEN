import type React from "react"
import ClientLayout from "./client-layout"

export const metadata = {
  title: "AbrahamNAVIG - ERC20 Token DApp",
  description: "Connect to MetaMask and interact with your ERC20 token on Base Sepolia",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>{children}</ClientLayout>
}


import './globals.css'