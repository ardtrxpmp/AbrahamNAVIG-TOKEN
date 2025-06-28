"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react"

export default function BaseSepoliaGuide() {
  const [isExpanded, setIsExpanded] = useState(false)

  const addBaseSepoliaToWallet = async () => {
    try {
      await window.ethereum?.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x14a34", // 84532 in hex
            chainName: "Base Sepolia",
            nativeCurrency: {
              name: "Ethereum",
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
    <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">ℹ️</span>
          <div>
            <h3 className="text-xl font-semibold text-white">Base Sepolia Setup</h3>
            <p className="text-blue-200">Need help connecting to Base Sepolia?</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          <Alert className="backdrop-blur-sm bg-blue-500/20 border-blue-400/30">
            <AlertDescription className="text-blue-200 space-y-3">
              <div>
                <strong>Step 1:</strong> Add Base Sepolia to your MetaMask
              </div>
              <Button
                onClick={addBaseSepoliaToWallet}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
              >
                <span className="mr-2">➕</span>
                Add Base Sepolia Network
              </Button>
            </AlertDescription>
          </Alert>

          <Alert className="backdrop-blur-sm bg-green-500/20 border-green-400/30">
            <AlertDescription className="text-green-200 space-y-3">
              <div>
                <strong>Step 2:</strong> Get Base Sepolia ETH for gas fees
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open("https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet", "_blank")}
                  className="backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Coinbase Faucet
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open("https://faucet.quicknode.com/base/sepolia", "_blank")}
                  className="backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  QuickNode Faucet
                </Button>
              </div>
            </AlertDescription>
          </Alert>

          <Alert className="backdrop-blur-sm bg-purple-500/20 border-purple-400/30">
            <AlertDescription className="text-purple-200 space-y-3">
              <div>
                <strong>Step 3:</strong> View your contract on Base Sepolia explorer
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open(
                    "https://sepolia.basescan.org/address/0x3B1af0A5922e1228e57Ec2325f3e2D3E3C2935e9",
                    "_blank",
                  )
                }
                className="backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Contract on BaseScan
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  )
}
