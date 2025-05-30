import { useEffect, useState } from "react";
import { useWalletConnection } from "@/contexts/walletConnectContext";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Typography } from "@mui/material";
import { targetChainId } from "../../wagmi.config";

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard = ({ children }: AdminGuardProps) => {
  const [isAdmin, setIsAdmin] = useState<boolean | undefined>(undefined);
  const { userAddress, isConnected, cRead, currentChain } =
    useWalletConnection();
  const wrongChain = currentChain?.id !== targetChainId;

  useEffect(() => {
    if (userAddress && isConnected) {
      cRead("isAdmin", []).then((res: any) => {
        setIsAdmin(res);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAddress, isConnected]);
  return (
    <>
      {/* Admin check logic */}
      {!isConnected || !userAddress || isAdmin == undefined || wrongChain ? (
        <div className="flex flex-col items-center min-h-screen mt-20">
          <Typography variant="h6" gutterBottom className="text-center px-10">
            Please connect your wallet to continue
          </Typography>
          <div className="mt-2">
            <ConnectButton />
          </div>
        </div>
      ) : isAdmin == true ? (
        children
      ) : (
        <div className="flex flex-col items-center min-h-screen mt-20">
          <h2 className="text-red-500 text-xl">
            Access Denied (You are not an admin)
          </h2>
          <p className="text-gray-500 text-sm">
            Please login Metamask as an administrator to get access to this
            page.
          </p>
        </div>
      )}
    </>
  );
};

export function withAdminGuard<T>(WrappedComponent: any) {
  const WithAdminGuard = (props: T) => {
    return (
      <AdminGuard>
        <WrappedComponent {...props} />
      </AdminGuard>
    );
  };

  // Copy display name for better debugging
  WithAdminGuard.displayName = `WithAdminGuard(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithAdminGuard;
}
export default AdminGuard;
