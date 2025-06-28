"use client"

import { useChainId, useSwitchChain } from "wagmi"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, ExternalLink } from "lucide-react"

const SUPPORTED_NETWORKS = {
  84532: "Base Sepolia", // Base Sepolia testnet
  8453: "Base Mainnet",
  1: "Ethereum Mainnet",
  11155111: "Sepolia Testnet",
  31337: "Hardhat Local",
  137: "Polygon Mainnet",
  80001: "Polygon Mumbai",
}

const RECOMMENDED_NETWORK = 84532 // Base Sepolia

interface NetworkCheckerProps {
  contractAddress: string
}

export default function NetworkChecker({ contractAddress }: NetworkCheckerProps) {
  const chainId = useChainId()
  const { switchChain, isPending } = useSwitchChain()

  const networkName = SUPPORTED_NETWORKS[chainId as keyof typeof SUPPORTED_NETWORKS] || `Unknown Network (${chainId})`
  const isSupported = chainId in SUPPORTED_NETWORKS
  const isRecommended = chainId === RECOMMENDED_NETWORK

  const getBlockExplorerUrl = (address: string) => {
    switch (chainId) {
      case 84532: // Base Sepolia
        return `https://sepolia.basescan.org/address/${address}`
      case 8453: // Base Mainnet
        return `https://basescan.org/address/${address}`
      case 1: // Ethereum Mainnet
        return `https://etherscan.io/address/${address}`
      case 11155111: // Sepolia
        return `https://sepolia.etherscan.io/address/${address}`
      default:
        return null
    }
  }

  const explorerUrl = getBlockExplorerUrl(contractAddress)

  if (isRecommended) {
    return (
      <div className="backdrop-blur-sm bg-green-500/20 rounded-xl p-4 border border-green-400/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-green-200">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">✅ Connected to {networkName} (Recommended)</span>
          </div>
          {explorerUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(explorerUrl, "_blank")}
              className="backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Contract
            </Button>
          )}
        </div>
        <div className="text-sm text-green-300 mt-2">🎯 Your token contract is deployed on this network</div>
      </div>
    )
  }

  if (isSupported) {
    return (
      <Alert className="backdrop-blur-sm bg-yellow-500/20 border-yellow-400/30">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-yellow-200 space-y-3">
          <div className="flex items-center justify-between">
            <span>
              <strong>Connected to {networkName}</strong>
            </span>
            {explorerUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(explorerUrl, "_blank")}
                className="backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Check Contract
              </Button>
            )}
          </div>
          <div className="text-sm">
            ⚠️ Your token is deployed on <strong>Base Sepolia</strong>. Switch to the recommended network for full
            functionality.
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => switchChain({ chainId: RECOMMENDED_NETWORK })}
            disabled={isPending}
            className="backdrop-blur-sm bg-blue-500/20 border-blue-400/30 text-blue-200 hover:bg-blue-500/30 transition-all duration-300"
          >
            {isPending ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                Switching...
              </>
            ) : (
              <>
                <span className="mr-2">🔄</span>
                Switch to Base Sepolia
              </>
            )}
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert variant="destructive" className="backdrop-blur-sm bg-red-500/20 border-red-400/30">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="text-red-200 space-y-3">
        <div>
          <strong>Unsupported Network:</strong> {networkName}
        </div>
        <div className="text-sm">
          🎯 Your token is deployed on <strong>Base Sepolia</strong>. Please switch to access your contract.
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => switchChain({ chainId: RECOMMENDED_NETWORK })}
            disabled={isPending}
            className="backdrop-blur-sm bg-blue-500/20 border-blue-400/30 text-blue-200 hover:bg-blue-500/30 transition-all duration-300"
          >
            {isPending ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                Switching...
              </>
            ) : (
              <>
                <span className="mr-2">🔄</span>
                Switch to Base Sepolia
              </>
            )}
          </Button>
          {Object.entries(SUPPORTED_NETWORKS)
            .filter(([id]) => Number.parseInt(id) !== RECOMMENDED_NETWORK)
            .map(([id, name]) => (
              <Button
                key={id}
                variant="outline"
                size="sm"
                onClick={() => switchChain({ chainId: Number.parseInt(id) })}
                disabled={isPending}
                className="backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300"
              >
                {name}
              </Button>
            ))}
        </div>
      </AlertDescription>
    </Alert>
  )
}
