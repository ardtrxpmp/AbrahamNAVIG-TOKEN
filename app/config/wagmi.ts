import { createConfig, http } from "wagmi"
import { mainnet, sepolia, hardhat, base, baseSepolia } from "wagmi/chains"
import { injected } from "wagmi/connectors"

export const config = createConfig({
  chains: [baseSepolia, base, mainnet, sepolia, hardhat],
  connectors: [injected()],
  transports: {
    [baseSepolia.id]: http(),
    [base.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [hardhat.id]: http(),
  },
})
