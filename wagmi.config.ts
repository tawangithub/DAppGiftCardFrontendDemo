import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { hardhat, polygonAmoy, sepolia } from "viem/chains";
import { createConfig, http } from "wagmi";
import { metaMaskWallet, rainbowWallet } from "@rainbow-me/rainbowkit/wallets";

const targetChain = process.env.NEXT_PUBLIC_TARGET_CHAIN || "hardhat";
const chains: any = [];
const transports: any = {};
if (targetChain === "hardhat") {
  chains.push(hardhat);
  transports[hardhat.id] = http();
} else if (targetChain === "polygonAmoy") {
  chains.push(polygonAmoy);
  transports[polygonAmoy.id] = http(
    process.env.NEXT_PUBLIC_POLYGON_AMOY_RPC || ""
  );
} else if (targetChain === "sepolia") {
  chains.push(sepolia);
  transports[sepolia.id] = http(process.env.NEXT_PUBLIC_SEPOLIA_RPC || "");
}

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [metaMaskWallet, rainbowWallet],
    },
  ],
  {
    appName: "DApp GiftCard Demo",
    projectId:
      process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "DEFAULT PROJECT ID",
  }
);

export const rainbowKitConfig = createConfig({
  chains: chains,
  transports: transports,
  connectors,
});
