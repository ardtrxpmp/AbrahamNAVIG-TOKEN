"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ExternalLink, Plus } from "lucide-react"

export default function BaseSepoliaGuide() {
  const [isOpen, setIsOpen] = useState(false)

  const addBaseSepoliaToMetaMask = async () => {
    try {
      await window.ethereum?.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x14A34", // 84532 in hex
            chainName: "Base Sepolia",
            nativeCurrency: {
              name: "ETH",
              symbol: "ETH",
              decimals: 18,
            },
            rpcUrls: ["https://sepolia.base.org"],
            blockExplorerUrls: ["https://sepolia.basescan.org"],
          },
        ],
      })
    } catch (error) {
      console.error("Failed to add Base Sepolia network:", error)
    }
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="outline"
          className="w-full backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300"
        >
          <span className="mr-2">🛠️</span>
          Base Sepolia Setup Guide
          <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-4">
        <Card className="backdrop-blur-md bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <span>⚡</span> Base Sepolia Network Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-white">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 backdrop-blur-sm bg-white/5 rounded-lg border border-white/10">
                <div>
                  <p className="font-medium">1. Add Base Sepolia Network</p>
                  <p className="text-sm text-blue-200">Add the network to your MetaMask</p>
                </div>
                <Button
                  onClick={addBaseSepoliaToMetaMask}
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Network
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 backdrop-blur-sm bg-white/5 rounded-lg border border-white/10">
                <div>
                  <p className="font-medium">2. Get Test ETH</p>
                  <p className="text-sm text-blue-200">Get free testnet ETH for gas fees</p>
                </div>
                <Button
                  onClick={() => window.open("https://www.alchemy.com/faucets/base-sepolia", "_blank")}
                  size="sm"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Faucet
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 backdrop-blur-sm bg-white/5 rounded-lg border border-white/10">
                <div>
                  <p className="font-medium">3. Alternative Faucet</p>
                  <p className="text-sm text-blue-200">Backup faucet option</p>
                </div>
                <Button
                  onClick={() => window.open("https://faucet.quicknode.com/base/sepolia", "_blank")}
                  size="sm"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  QuickNode
                </Button>
              </div>
            </div>

            <div className="mt-4 p-3 backdrop-blur-sm bg-blue-500/20 rounded-lg border border-blue-400/30">
              <p className="text-sm text-blue-200">
                <strong>Network Details:</strong>
                <br />• Chain ID: 84532
                <br />• RPC URL: https://sepolia.base.org
                <br />• Explorer: https://sepolia.basescan.org
              </p>
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  )
}
