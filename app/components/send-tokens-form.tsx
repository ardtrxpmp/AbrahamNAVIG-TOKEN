"use client"

import type React from "react"

import { useState } from "react"
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi"
import { parseUnits } from "viem"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle } from "lucide-react"

const CONTRACT_ABI = [
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
] as const

interface SendTokensFormProps {
  contractAddress: string
}

export default function SendTokensForm({ contractAddress }: SendTokensFormProps) {
  const [addresses, setAddresses] = useState<string[]>([""])
  const [amount, setAmount] = useState("")
  const [bulkAddresses, setBulkAddresses] = useState("")
  const [showBulkInput, setShowBulkInput] = useState(false)

  const { data: decimals } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "decimals",
  })

  const { writeContract, data: hash, isPending: isWritePending, error: writeError } = useWriteContract()

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash,
  })

  const addAddressField = () => {
    if (addresses.length < 11) {
      setAddresses([...addresses, ""])
    }
  }

  const removeAddressField = (index: number) => {
    if (addresses.length > 1) {
      setAddresses(addresses.filter((_, i) => i !== index))
    }
  }

  const updateAddress = (index: number, value: string) => {
    const newAddresses = [...addresses]
    newAddresses[index] = value
    setAddresses(newAddresses)
  }

  const processBulkAddresses = () => {
    const bulkList = bulkAddresses
      .split("\n")
      .map((addr) => addr.trim())
      .filter((addr) => addr.length > 0)
      .slice(0, 11)

    setAddresses(bulkList.length > 0 ? bulkList : [""])
    setBulkAddresses("")
    setShowBulkInput(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!decimals) {
      return
    }

    const validAddresses = addresses.filter(
      (addr) => addr.trim().length > 0 && addr.startsWith("0x") && addr.length === 42,
    )

    if (validAddresses.length === 0) {
      return
    }

    if (!amount || Number.parseFloat(amount) <= 0) {
      return
    }

    try {
      const amountInWei = parseUnits(amount, decimals)

      writeContract({
        address: contractAddress as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: "sendToClassmates",
        args: [validAddresses as `0x${string}`[], amountInWei],
      })
    } catch (error) {
      console.error("Error sending tokens:", error)
    }
  }

  const validAddresses = addresses.filter(
    (addr) => addr.trim().length > 0 && addr.startsWith("0x") && addr.length === 42,
  )

  const isFormValid = validAddresses.length > 0 && amount && Number.parseFloat(amount) > 0

  return (
    <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">🚀</span>
        <div>
          <h3 className="text-xl font-semibold text-white">Send Tokens to Classmates</h3>
          <p className="text-blue-200">
            Send tokens to up to 11 addresses at once. Each address will receive the same amount.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Transaction Status */}
        {writeError && (
          <Alert variant="destructive" className="backdrop-blur-sm bg-red-500/20 border-red-400/30">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-200">Transaction failed: {writeError.message}</AlertDescription>
          </Alert>
        )}

        {receiptError && (
          <Alert variant="destructive" className="backdrop-blur-sm bg-red-500/20 border-red-400/30">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-200">
              Transaction receipt error: {receiptError.message}
            </AlertDescription>
          </Alert>
        )}

        {hash && (
          <Alert className="backdrop-blur-sm bg-green-500/20 border-green-400/30">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-green-200">
              <span className="flex items-center gap-2">
                <span>✅</span>
                Transaction submitted! Hash: {hash.slice(0, 10)}...
              </span>
              {isConfirming && (
                <span className="ml-2 flex items-center gap-1">
                  <span className="animate-spin">⟳</span> Confirming...
                </span>
              )}
              {isConfirmed && (
                <span className="ml-2 text-green-300 font-semibold flex items-center gap-1">
                  <span>🎉</span> Confirmed!
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Input */}
          <div className="backdrop-blur-sm bg-white/5 rounded-xl p-4 border border-white/10">
            <Label htmlFor="amount" className="text-white flex items-center gap-2 mb-2">
              <span>💎</span> Amount per Address
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.000001"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="backdrop-blur-sm bg-white/10 border-white/20 text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
            />
            <p className="text-sm text-blue-200 mt-2 flex items-center gap-1">
              <span>ℹ️</span> Each address will receive this amount of tokens
            </p>
          </div>

          {/* Address Input Methods */}
          <div className="backdrop-blur-sm bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-white flex items-center gap-2">
                <span>📧</span> Recipient Addresses ({validAddresses.length}/11)
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowBulkInput(!showBulkInput)}
                className="backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300"
              >
                {showBulkInput ? "📝 Individual Input" : "📋 Bulk Input"}
              </Button>
            </div>

            {showBulkInput ? (
              <div className="space-y-3">
                <Textarea
                  placeholder="Enter addresses (one per line)&#10;0x1234...&#10;0x5678...&#10;0x9abc..."
                  value={bulkAddresses}
                  onChange={(e) => setBulkAddresses(e.target.value)}
                  rows={6}
                  className="backdrop-blur-sm bg-white/10 border-white/20 text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={processBulkAddresses}
                  className="w-full backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                >
                  <span className="mr-2">⚡</span>
                  Process Bulk Addresses
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((address, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Address ${index + 1} (0x...)`}
                      value={address}
                      onChange={(e) => updateAddress(index, e.target.value)}
                      className={`flex-1 backdrop-blur-sm bg-white/10 border-white/20 text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 ${
                        address && (!address.startsWith("0x") || address.length !== 42)
                          ? "border-red-400/50 focus:border-red-400"
                          : ""
                      }`}
                    />
                    {addresses.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeAddressField(index)}
                        className="backdrop-blur-sm bg-red-500/20 border-red-400/30 text-red-200 hover:bg-red-500/30 transition-all duration-300"
                      >
                        <span>➖</span>
                      </Button>
                    )}
                  </div>
                ))}

                {addresses.length < 11 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addAddressField}
                    className="w-full backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                  >
                    <span className="mr-2">➕</span>
                    Add Address ({addresses.length}/11)
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Summary */}
          {validAddresses.length > 0 && amount && (
            <div className="backdrop-blur-sm bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-4 border border-blue-400/30">
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <span>📊</span> Transaction Summary
              </h4>
              <div className="text-sm text-blue-200 space-y-2">
                <div className="flex items-center gap-2">
                  <span>👥</span> Recipients:{" "}
                  <span className="text-white font-semibold">{validAddresses.length} addresses</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>💰</span> Amount per recipient:{" "}
                  <span className="text-white font-semibold">{amount} tokens</span>
                </div>
                <div className="flex items-center gap-2 text-base">
                  <span>🎯</span> Total tokens to send:
                  <span className="text-yellow-300 font-bold">
                    {(Number.parseFloat(amount) * validAddresses.length).toFixed(6)} tokens
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!isFormValid || isWritePending || isConfirming}
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            size="lg"
          >
            {isWritePending || isConfirming ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                {isWritePending ? "Sending Transaction..." : "Confirming..."}
              </>
            ) : (
              <>
                <span className="mr-2">🚀</span>
                Send Tokens to Classmates
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
