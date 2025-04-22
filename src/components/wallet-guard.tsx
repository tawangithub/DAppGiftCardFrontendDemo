import { ReactNode, useEffect, useState } from "react";
import { Container, Typography, Box } from "@mui/material";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useWalletConnection } from "@/contexts/walletConnectContext";
import { targetChainId } from "../../wagmi.config";

interface WalletGuardProps {
  children: ReactNode;
  message?: string;
}

const WalletGuard = ({
  children,
  message = "Please connect your wallet to continue",
}: WalletGuardProps) => {
  const { userAddress, isConnected, currentChain } = useWalletConnection();
  const [ready, isReady] = useState<boolean>(false);

  // need this useEffect to prevent dehydration error
  useEffect(() => {
    if (userAddress && isConnected) {
      isReady(true);
    } else {
      isReady(false);
    }
  }, [userAddress, isConnected]);

  const wrongChain = currentChain?.id !== targetChainId;

  if (!ready || wrongChain) {
    return (
      <Container>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="60vh"
          gap={2}
        >
          <Typography variant="h6" gutterBottom className="text-center px-10">
            {message}
          </Typography>
          <ConnectButton />
        </Box>
      </Container>
    );
  }

  return <>{children}</>;
};

export function withWalletGuard<T>(WrappedComponent: any) {
  const WithWalletGuard = (props: T) => {
    return (
      <WalletGuard>
        <WrappedComponent {...props} />
      </WalletGuard>
    );
  };

  // Copy display name for better debugging
  WithWalletGuard.displayName = `WithWalletGuard(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithWalletGuard;
}

export default WalletGuard;
