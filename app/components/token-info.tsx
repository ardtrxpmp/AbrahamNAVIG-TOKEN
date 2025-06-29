"use client"

import { useReadContract } from "wagmi"
import { formatUnits } from "viem"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCw, ExternalLink } from "lucide-react"

const ERC20_ABI = [
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
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
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const

interface TokenInfoProps {
  contractAddress: string
}

export default function TokenInfo({ contractAddress }: TokenInfoProps) {
  const {
    data: name,
    isLoading: nameLoading,
    refetch: refetchName,
  } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "name",
  })

  const {
    data: symbol,
    isLoading: symbolLoading,
    refetch: refetchSymbol,
  } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "symbol",
  })

  const {
    data: decimals,
    isLoading: decimalsLoading,
    refetch: refetchDecimals,
  } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "decimals",
  })

  const {
    data: totalSupply,
    isLoading: totalSupplyLoading,
    refetch: refetchTotalSupply,
  } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "totalSupply",
  })

  const handleRefresh = () => {
    refetchName()
    refetchSymbol()
    refetchDecimals()
    refetchTotalSupply()
  }

  const isLoading = nameLoading || symbolLoading || decimalsLoading || totalSupplyLoading

  return (
    <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-2xl">🪙</span>
          Token Information
        </CardTitle>
        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => window.open(`https://sepolia.basescan.org/address/${contractAddress}`, "_blank")}
            variant="outline"
            size="sm"
            className="backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="backdrop-blur-sm bg-white/5 rounded-lg p-3 border border-white/10">
            <p className="text-sm text-blue-200 mb-1">Name</p>
            {nameLoading ? (
              <Skeleton className="h-6 w-24 bg-white/20" />
            ) : (
              <p className="font-semibold text-white">{name || "Unknown"}</p>
            )}
          </div>

          <div className="backdrop-blur-sm bg-white/5 rounded-lg p-3 border border-white/10">
            <p className="text-sm text-blue-200 mb-1">Symbol</p>
            {symbolLoading ? (
              <Skeleton className="h-6 w-16 bg-white/20" />
            ) : (
              <p className="font-semibold text-white">{symbol || "Unknown"}</p>
            )}
          </div>

          <div className="backdrop-blur-sm bg-white/5 rounded-lg p-3 border border-white/10">
            <p className="text-sm text-blue-200 mb-1">Decimals</p>
            {decimalsLoading ? (
              <Skeleton className="h-6 w-8 bg-white/20" />
            ) : (
              <p className="font-semibold text-white">{decimals?.toString() || "Unknown"}</p>
            )}
          </div>

          <div className="backdrop-blur-sm bg-white/5 rounded-lg p-3 border border-white/10">
            <p className="text-sm text-blue-200 mb-1">Total Supply</p>
            {totalSupplyLoading ? (
              <Skeleton className="h-6 w-32 bg-white/20" />
            ) : (
              <p className="font-semibold text-white">
                {totalSupply && decimals ? Number(formatUnits(totalSupply, decimals)).toLocaleString() : "Unknown"}
              </p>
            )}
          </div>
        </div>

        <div className="backdrop-blur-sm bg-white/5 rounded-lg p-3 border border-white/10">
          <p className="text-sm text-blue-200 mb-1">Contract Address</p>
          <p className="font-mono text-xs text-white break-all">{contractAddress}</p>
        </div>
      </CardContent>
    </Card>
  )
}
