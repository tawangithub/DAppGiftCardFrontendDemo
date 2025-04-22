import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { hardhat, polygonAmoy, sepolia } from "viem/chains";
import { createConfig, http } from "wagmi";
import {
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

export const targetChainId = process.env.NEXT_PUBLIC_TARGET_CHAIN_ID
  ? Number(process.env.NEXT_PUBLIC_TARGET_CHAIN_ID)
  : 31337;

const chains: any = [];

const transports: any = {};
if (targetChainId == hardhat.id) {
  chains.push(hardhat);
  transports[hardhat.id] = http();
} else if (targetChainId == polygonAmoy.id) {
  chains.push(polygonAmoy);
  transports[polygonAmoy.id] = http(
    process.env.NEXT_PUBLIC_POLYGON_AMOY_RPC || ""
  );
} else if (targetChainId == sepolia.id) {
  chains.push(sepolia);
  transports[sepolia.id] = http(process.env.NEXT_PUBLIC_SEPOLIA_RPC || "");
}

console.log("SepoliaId:", sepolia.id);
import { isMobile, isTablet } from "react-device-detect";

const isMobileDevice = isMobile || isTablet;
const wallets: any[] = [];
if (isMobileDevice) {
  wallets.push(walletConnectWallet);
} else {
  wallets.push(metaMaskWallet, rainbowWallet, walletConnectWallet);
}

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets,
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
