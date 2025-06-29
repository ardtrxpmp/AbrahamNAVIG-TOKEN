import { http, createConfig } from "wagmi"
import { base, baseSepolia, mainnet, sepolia } from "wagmi/chains"
import { injected, metaMask, safe } from "wagmi/connectors"

const projectId = "YOUR_PROJECT_ID"

export const config = createConfig({
  chains: [baseSepolia, base, mainnet, sepolia],
  connectors: [injected(), metaMask(), safe()],
  transports: {
    [baseSepolia.id]: http(),
    [base.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})

declare module "wagmi" {
  interface Register {
    config: typeof config
  }
}
