import { http, createConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";

const sonic = {
  id: 146,
  name: "Sonic",
  network: "sonic",
  nativeCurrency: {
    decimals: 18,
    name: "Sonic",
    symbol: "S",
  },
  rpcUrls: {
    public: { http: ["https://rpc.soniclabs.com/"] },
    default: { http: ["https://rpc.soniclabs.com/"] },
  },
  blockExplorers: {
    default: { name: "SonicScan", url: "https://sonicscan.org" },
  },
} as const;

export const config = createConfig({
  chains: [mainnet, sepolia, sonic],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [sonic.id]: http(),
  },
});
