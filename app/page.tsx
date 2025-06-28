"use client"

import { useState } from "react"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { injected } from "wagmi/connectors"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import TokenInfo from "./components/token-info"
import WalletBalance from "./components/wallet-balance"
import SendTokensForm from "./components/send-tokens-form"
import NetworkChecker from "./components/network-checker"
import BaseSepoliaGuide from "./components/base-sepolia-guide"

// Your contract address on Base Sepolia
const CONTRACT_ADDRESS = "0x3B1af0A5922e1228e57Ec2325f3e2D3E3C2935e9"

export default function Home() {
  const { address, isConnected } = useAccount()
  const { connect, isPending: isConnecting, error: connectError } = useConnect()
  const { disconnect } = useDisconnect()
  const [contractAddress, setContractAddress] = useState(CONTRACT_ADDRESS)

  const handleConnect = () => {
    connect({ connector: injected() })
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden flex items-center justify-center p-4">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute top-40 left-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative z-10 backdrop-blur-md bg-white/10 rounded-2xl p-8 border border-white/20 shadow-2xl w-full max-w-md">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <span className="text-2xl">⚡</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2">
              AbrahamNAVIG
            </h1>
            <p className="text-blue-200 mb-2">Navigate the crypto universe with your classmates</p>
            <div className="text-sm text-blue-300 mb-6 backdrop-blur-sm bg-white/5 rounded-lg p-2 border border-white/10">
              🔗 Powered by Base Sepolia
            </div>
          </div>

          {connectError && (
            <Alert variant="destructive" className="mb-4 backdrop-blur-sm bg-red-500/20 border-red-400/30">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-200">{connectError.message}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            size="lg"
          >
            {isConnecting ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                Connecting...
              </>
            ) : (
              <>
                <span className="mr-2">🦊</span>
                Connect MetaMask
              </>
            )}
          </Button>

          <div className="mt-4 text-xs text-blue-300 text-center">
            Make sure to switch to Base Sepolia network after connecting
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent flex items-center gap-3">
                <span className="text-3xl">⚡</span>
                AbrahamNAVIG
              </h1>
              <p className="text-blue-200 mt-2">Navigate the crypto universe with your classmates</p>
              <div className="text-sm text-blue-300 mt-1 flex items-center gap-2">
                <span>🔗</span> Powered by Base Sepolia
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-blue-200 backdrop-blur-sm bg-white/10 rounded-lg p-3 border border-white/20">
                <div className="font-medium flex items-center gap-2">
                  <span>🔗</span> Connected:
                </div>
                <div className="font-mono text-white">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => disconnect()}
                className="backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300"
              >
                Disconnect
              </Button>
            </div>
          </div>

          {/* Network Status */}
          <NetworkChecker contractAddress={contractAddress} />

          {/* Base Sepolia Setup Guide */}
          <BaseSepoliaGuide />

          {/* Contract Address Input */}
          <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">⚙️</span>
              <div>
                <h3 className="text-xl font-semibold text-white">Contract Configuration</h3>
                <p className="text-blue-200">Your ERC20 token contract on Base Sepolia</p>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                placeholder="0x..."
                className="flex-1 px-4 py-3 backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
              />
              <Button
                variant="outline"
                onClick={() => setContractAddress(CONTRACT_ADDRESS)}
                className="backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300"
              >
                Reset
              </Button>
            </div>
            <div className="mt-2 text-xs text-blue-300">Default: Your token contract on Base Sepolia</div>
          </div>

          {/* Token Info and Balance */}
          <div className="grid md:grid-cols-2 gap-6">
            <TokenInfo contractAddress={contractAddress} />
            <WalletBalance contractAddress={contractAddress} walletAddress={address} />
          </div>

          {/* Send Tokens Form */}
          <SendTokensForm contractAddress={contractAddress} />
        </div>
      </div>
    </div>
  )
}
