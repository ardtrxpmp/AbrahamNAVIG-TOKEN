"use client"

import type React from "react"

import { useState } from "react"
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi"
import { parseUnits } from "viem"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, AlertCircle, Loader2, Plus, Minus, Send } from "lucide-react"

const ERC20_ABI = [
  {
    inputs: [
      { internalType: "address[]", name: "classmates", type: "address[]" },
      { internalType: "uint256", name: "amountEach", type: "uint256" },
    ],
    name: "sendToClassmates",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
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
  const [inputMode, setInputMode] = useState<"individual" | "bulk">("individual")

  const { data: decimals } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "decimals",
  })

  const { data: symbol } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "symbol",
  })

  const { writeContract, data: hash, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
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

  const parseBulkAddresses = () => {
    const parsed = bulkAddresses
      .split(/[\n,;]/)
      .map((addr) => addr.trim())
      .filter((addr) => addr.length > 0)
      .slice(0, 11)

    setAddresses(parsed.length > 0 ? parsed : [""])
    setInputMode("individual")
  }

  const getValidAddresses = () => {
    return inputMode === "individual"
      ? addresses.filter((addr) => addr.trim().length > 0 && addr.startsWith("0x"))
      : bulkAddresses
          .split(/[\n,;]/)
          .map((addr) => addr.trim())
          .filter((addr) => addr.length > 0 && addr.startsWith("0x"))
          .slice(0, 11)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validAddresses = getValidAddresses()

    if (validAddresses.length === 0) {
      return
    }

    if (!amount || !decimals) {
      return
    }

    try {
      const amountInWei = parseUnits(amount, decimals)

      writeContract({
        address: contractAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "sendToClassmates",
        args: [validAddresses as `0x${string}`[], amountInWei],
      })
    } catch (err) {
      console.error("Transaction failed:", err)
    }
  }

  const validAddresses = getValidAddresses()
  const totalAmount = validAddresses.length > 0 && amount ? (Number(amount) * validAddresses.length).toString() : "0"

  const resetForm = () => {
    setAddresses([""])
    setAmount("")
    setBulkAddresses("")
    setInputMode("individual")
  }

  return (
    <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-2xl">🚀</span>
          Send Tokens to Classmates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isSuccess && (
          <Alert className="backdrop-blur-sm bg-green-500/20 border-green-400/30">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-green-200">
              ✅ Tokens sent successfully!
              {hash && (
                <a
                  href={`https://sepolia.basescan.org/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 underline hover:text-green-100"
                >
                  View transaction
                </a>
              )}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="backdrop-blur-sm bg-red-500/20 border-red-400/30">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-200">{error.message}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-white flex items-center gap-2">
              <span>💎</span> Amount per recipient
            </Label>
            <div className="flex gap-2">
              <Input
                id="amount"
                type="number"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                className="backdrop-blur-sm bg-white/10 border-white/20 text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400"
                required
              />
              <div className="flex items-center px-3 backdrop-blur-sm bg-white/10 border border-white/20 rounded-md">
                <span className="text-white text-sm">{symbol || "TOKEN"}</span>
              </div>
            </div>
          </div>

          {/* Address Input Tabs */}
          <Tabs value={inputMode} onValueChange={(value) => setInputMode(value as "individual" | "bulk")}>
            <TabsList className="grid w-full grid-cols-2 backdrop-blur-sm bg-white/10">
              <TabsTrigger value="individual" className="text-white data-[state=active]:bg-white/20">
                📧 Individual
              </TabsTrigger>
              <TabsTrigger value="bulk" className="text-white data-[state=active]:bg-white/20">
                📝 Bulk Input
              </TabsTrigger>
            </TabsList>

            <TabsContent value="individual" className="space-y-4">
              <div className="space-y-3">
                <Label className="text-white flex items-center gap-2">
                  <span>📧</span> Recipient Addresses (max 11)
                </Label>

                {addresses.map((address, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={address}
                      onChange={(e) => updateAddress(index, e.target.value)}
                      placeholder="0x..."
                      className="backdrop-blur-sm bg-white/10 border-white/20 text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400"
                    />
                    {addresses.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeAddressField(index)}
                        variant="outline"
                        size="icon"
                        className="backdrop-blur-sm bg-red-500/20 border-red-400/30 text-red-300 hover:bg-red-500/30"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}

                {addresses.length < 11 && (
                  <Button
                    type="button"
                    onClick={addAddressField}
                    variant="outline"
                    className="w-full backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address ({addresses.length}/11)
                  </Button>
                )}
              </div>
            </TabsContent>

            <TabsContent value="bulk" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bulk-addresses" className="text-white flex items-center gap-2">
                  <span>📝</span> Bulk Address Input
                </Label>
                <Textarea
                  id="bulk-addresses"
                  value={bulkAddresses}
                  onChange={(e) => setBulkAddresses(e.target.value)}
                  placeholder="Enter addresses separated by commas, semicolons, or new lines&#10;0x1234...&#10;0x5678...&#10;0x9abc..."
                  rows={6}
                  className="backdrop-blur-sm bg-white/10 border-white/20 text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400"
                />
                <Button
                  type="button"
                  onClick={parseBulkAddresses}
                  variant="outline"
                  className="backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Parse Addresses
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Transaction Summary */}
          {validAddresses.length > 0 && amount && (
            <div className="backdrop-blur-sm bg-white/5 rounded-lg p-4 border border-white/10">
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <span>🎯</span> Transaction Summary
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-blue-200">
                  <span>Recipients:</span>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                    {validAddresses.length}
                  </Badge>
                </div>
                <div className="flex justify-between text-blue-200">
                  <span>Amount per recipient:</span>
                  <span className="text-white">
                    {amount} {symbol}
                  </span>
                </div>
                <Separator className="bg-white/20" />
                <div className="flex justify-between text-white font-semibold">
                  <span>Total amount:</span>
                  <span>
                    {totalAmount} {symbol}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isPending || isConfirming || validAddresses.length === 0 || !amount}
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-300"
            >
              {isPending || isConfirming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isPending ? "Confirming..." : "Processing..."}
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Tokens to Classmates
                </>
              )}
            </Button>

            {(isSuccess || error) && (
              <Button
                type="button"
                onClick={resetForm}
                variant="outline"
                className="backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Reset
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
