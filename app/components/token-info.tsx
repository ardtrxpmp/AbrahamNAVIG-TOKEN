"use client"

import { useReadContract, useChainId } from "wagmi"
import { formatUnits } from "viem"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

const ERC20_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "allowance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256",
      },
    ],
    name: "ERC20InsufficientAllowance",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256",
      },
    ],
    name: "ERC20InsufficientBalance",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "approver",
        type: "address",
      },
    ],
    name: "ERC20InvalidApprover",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "ERC20InvalidReceiver",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "ERC20InvalidSender",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "ERC20InvalidSpender",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "classmates",
        type: "address[]",
      },
      {
        internalType: "uint256",
        name: "amountEach",
        type: "uint256",
      },
    ],
    name: "sendToClassmates",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
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
    error: nameError,
  } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "name",
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

  const { data: totalSupply, isLoading: totalSupplyLoading } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "totalSupply",
  })

  const chainId = useChainId()

  const isLoading = nameLoading || symbolLoading || decimalsLoading || totalSupplyLoading

  if (nameError) {
    return (
      <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🪙</span>
          <h3 className="text-xl font-semibold text-white">Token Information</h3>
        </div>
        <Alert variant="destructive" className="backdrop-blur-sm bg-red-500/20 border-red-400/30">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-200 space-y-2">
            <div>Failed to load token information.</div>
            <div className="text-sm">
              <strong>Possible causes:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Contract not deployed on current network (Chain ID: {chainId})</li>
                <li>Invalid contract address format</li>
                <li>Network connection issues</li>
                <li>Contract doesn't implement ERC20 standard functions</li>
              </ul>
            </div>
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
              <strong>Contract Address:</strong> {contractAddress}
            </div>
            <div className="text-sm">
              <strong>Error Details:</strong> {nameError.message}
            </div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">🪙</span>
        <div>
          <h3 className="text-xl font-semibold text-white">Token Information</h3>
          <p className="text-blue-200">Details about the ERC20 token contract</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="backdrop-blur-sm bg-white/5 rounded-xl p-4 border border-white/10">
            <label className="text-sm font-medium text-blue-200 flex items-center gap-2">
              <span>📛</span> Name
            </label>
            {isLoading ? (
              <Skeleton className="h-6 w-full mt-2 bg-white/20" />
            ) : (
              <div className="text-lg font-semibold text-white mt-1">{name || "Unknown"}</div>
            )}
          </div>
          <div className="backdrop-blur-sm bg-white/5 rounded-xl p-4 border border-white/10">
            <label className="text-sm font-medium text-blue-200 flex items-center gap-2">
              <span>🏷️</span> Symbol
            </label>
            {isLoading ? (
              <Skeleton className="h-6 w-full mt-2 bg-white/20" />
            ) : (
              <div className="text-lg font-semibold text-white mt-1">{symbol || "Unknown"}</div>
            )}
          </div>
        </div>

        <div className="backdrop-blur-sm bg-white/5 rounded-xl p-4 border border-white/10">
          <label className="text-sm font-medium text-blue-200 flex items-center gap-2">
            <span>💰</span> Total Supply
          </label>
          {isLoading ? (
            <Skeleton className="h-8 w-full mt-2 bg-white/20" />
          ) : (
            <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mt-1">
              {totalSupply && decimals ? `${formatUnits(totalSupply, decimals)} ${symbol}` : "Loading..."}
            </div>
          )}
        </div>

        <div className="backdrop-blur-sm bg-white/5 rounded-xl p-4 border border-white/10">
          <label className="text-sm font-medium text-blue-200 flex items-center gap-2">
            <span>📋</span> Contract Address
          </label>
          <div className="text-sm font-mono text-white bg-black/20 p-3 rounded-lg mt-2 break-all border border-white/10">
            {contractAddress}
          </div>
        </div>
      </div>
    </div>
  )
}
