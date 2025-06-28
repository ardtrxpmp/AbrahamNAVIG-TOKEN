"use client"

import { useReadContract, useChainId } from "wagmi"
import { formatUnits } from "viem"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const ERC20_ABI = [
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
] as const

interface WalletBalanceProps {
  contractAddress: string
  walletAddress: string | undefined
}

export default function WalletBalance({ contractAddress, walletAddress }: WalletBalanceProps) {
  const {
    data: balance,
    isLoading: balanceLoading,
    error: balanceError,
    refetch: refetchBalance,
  } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: walletAddress ? [walletAddress as `0x${string}`] : undefined,
  })

  const { data: symbol, isLoading: symbolLoading } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "symbol",
  })

  const { data: decimals, isLoading: decimalsLoading } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "decimals",
  })

  const isLoading = balanceLoading || symbolLoading || decimalsLoading

  const chainId = useChainId()

  if (balanceError) {
    return (
      <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">👛</span>
          <h3 className="text-xl font-semibold text-white">Your Balance</h3>
        </div>
        <Alert variant="destructive" className="backdrop-blur-sm bg-red-500/20 border-red-400/30">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-200 space-y-2">
            <div>Failed to load balance.</div>
            <div className="text-sm">
              <strong>Current Network:</strong>{" "}
              {chainId === 1
                ? "Ethereum Mainnet"
                : chainId === 11155111
                  ? "Sepolia Testnet"
                  : chainId === 31337
                    ? "Hardhat Local"
                    : `Chain ID ${chainId}`}
            </div>
            <div className="text-sm">
              <strong>Error:</strong> {balanceError.message}
            </div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">👛</span>
        <div>
          <h3 className="text-xl font-semibold text-white">Your Balance</h3>
          <p className="text-blue-200">Your current token balance</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="text-center backdrop-blur-sm bg-white/5 rounded-xl p-6 border border-white/10">
          {isLoading ? (
            <Skeleton className="h-16 w-full bg-white/20" />
          ) : (
            <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
              {balance && decimals ? `${formatUnits(balance, decimals)} ${symbol}` : "0 Tokens"}
            </div>
          )}
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchBalance()}
            disabled={isLoading}
            className="backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300"
          >
            <span className="mr-2">🔄</span>
            Refresh Balance
          </Button>
        </div>

        <div className="text-sm text-blue-200 text-center backdrop-blur-sm bg-white/5 rounded-lg p-3 border border-white/10">
          <div className="flex items-center justify-center gap-2">
            <span>🔗</span>
            Wallet: {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
          </div>
        </div>
      </div>
    </div>
  )
}
