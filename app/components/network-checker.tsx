"use client"

import { useAccount, useChainId, useSwitchChain } from "wagmi"
import { baseSepolia } from "wagmi/chains"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle, ExternalLink } from "lucide-react"

interface NetworkCheckerProps {
  contractAddress?: string
}

export default function NetworkChecker({ contractAddress }: NetworkCheckerProps) {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain, isPending } = useSwitchChain()

  if (!isConnected) return null

  const isCorrectNetwork = chainId === baseSepolia.id
  const currentNetwork =
    chainId === baseSepolia.id
      ? "Base Sepolia"
      : chainId === 8453
        ? "Base Mainnet"
        : chainId === 1
          ? "Ethereum Mainnet"
          : chainId === 11155111
            ? "Sepolia"
            : `Unknown (${chainId})`

  return (
    <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        {isCorrectNetwork ? (
          <CheckCircle className="h-6 w-6 text-green-400" />
        ) : (
          <AlertTriangle className="h-6 w-6 text-yellow-400" />
        )}
        <div>
          <h3 className="text-xl font-semibold text-white">Network Status</h3>
          <p className="text-blue-200">Current: {currentNetwork}</p>
        </div>
      </div>

      {isCorrectNetwork ? (
        <Alert className="backdrop-blur-sm bg-green-500/20 border-green-400/30">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription className="text-green-200">
            ✅ Connected to Base Sepolia - Ready to interact with your token!
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          <Alert variant="destructive" className="backdrop-blur-sm bg-yellow-500/20 border-yellow-400/30">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-yellow-200">
              ⚠️ Please switch to Base Sepolia network to interact with your token contract.
            </AlertDescription>
          </Alert>

          <div className="flex gap-2">
            <Button
              onClick={() => switchChain({ chainId: baseSepolia.id })}
              disabled={isPending}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              {isPending ? "Switching..." : "Switch to Base Sepolia"}
            </Button>

            {contractAddress && (
              <Button
                variant="outline"
                onClick={() => window.open(`https://sepolia.basescan.org/address/${contractAddress}`, "_blank")}
                className="backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Contract
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
