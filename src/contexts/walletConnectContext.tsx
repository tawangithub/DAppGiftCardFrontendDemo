import { createContext, useContext, ReactNode } from "react";
import { useWalletHook } from "@/hooks/wallet-connection-hook";
import Web3 from "web3";
import { cWriteFunction, cReadFunction } from "@/hooks/wallet-connection-hook";

interface WalletConnectionContextType {
  userAddress: string;
  isConnected: boolean;
  web3: Web3 | null;
  cWrite: cWriteFunction;
  cRead: cReadFunction;
}

const WalletConnectionContext = createContext<
  WalletConnectionContextType | undefined
>(undefined);

export function WalletConnectionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const walletConnection = useWalletHook();

  return (
    <WalletConnectionContext.Provider value={walletConnection}>
      {children}
    </WalletConnectionContext.Provider>
  );
}

export function useWalletConnection() {
  const context = useContext(WalletConnectionContext);
  if (context === undefined) {
    throw new Error(
      "useWalletConnectionContext must be used within a WalletConnectionProvider"
    );
  }
  return context;
}
