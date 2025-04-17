import { useState, useEffect } from "react";
import Web3 from "web3";
import GiftCardLogicABI from "../web3/contracts/GiftCardLogic.json";
import {
  BaseError,
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

import {
  readContract,
  simulateContract,
  waitForTransactionReceipt,
} from "@wagmi/core";

import { rainbowKitConfig } from "../../wagmi.config";
import { useLoading } from "@/contexts/loading";
import { useCustomDialog } from "@/contexts/customDialogContext";
// import { ethers } from "ethers";

export type cWriteFunction = (
  functionName: string,
  args: any[],
  value?: bigint
) => Promise<void>;

export type cReadFunction = (functionName: string, args: any[]) => Promise<any>;

export const useWalletHook = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const { address: userAddress, isConnected } = useAccount();
  const { cWrite } = useWriteContractHook();
  const { cRead } = useReadContractHook();
  useEffect(() => {
    // Listen for account changes
    window.ethereum.on("accountsChanged", function () {
      window.location.reload();
    });

    // Listen for chain changes
    window.ethereum.on("chainChanged", function () {
      window.location.reload();
    });
    return () => {
      window.ethereum.removeListener("accountsChanged", function () {});
      window.ethereum.removeListener("chainChanged", function () {});
    };
  }, []);

  useEffect(() => {
    if (userAddress && window.ethereum) {
      setWeb3(new Web3(window.ethereum));
    }
  }, [userAddress]);

  return {
    userAddress: userAddress as string,
    isConnected,
    web3,
    cWrite,
    cRead,
  };
};

const useWriteContractHook = () => {
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const { writeContractAsync } = useWriteContract();
  const { showStatusDialog } = useCustomDialog();
  const { setIsLoading } = useLoading();
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
    query: {
      enabled: txHash != null,
    },
  });

  useEffect(() => {
    if (isConfirmed) {
      showStatusDialog("Confirmed", "Transaction completed");
    } else if (isConfirming) {
      showStatusDialog(
        "Verifying",
        "Please wait while the transaction is being verfied..."
      );
    } else if (receiptError) {
      showStatusDialog("Error", "Transaction failed");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txHash, isConfirmed, isConfirming, receiptError]);

  const cWrite: cWriteFunction = async (
    functionName: string,
    functionArgs: any[],
    value?: bigint
  ) => {
    try {
      setIsLoading(true);

      const { request } = await simulateContract(rainbowKitConfig, {
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
        abi: GiftCardLogicABI.abi,
        functionName,
        args: functionArgs,
        // maxFeePerGas: ethers.parseUnits("35", "gwei"),
        // maxPriorityFeePerGas: ethers.parseUnits("1.5", "gwei"),
        value: value ? BigInt(value) : undefined,
      });

      const txHash = await writeContractAsync(request); // only runs if simulate passed

      if (txHash != null) {
        setTxHash(txHash);
      }
      await waitForTransactionReceipt(rainbowKitConfig, { hash: txHash }); // waits for it to be mined
    } catch (err: any) {
      const rawReason =
        err?.cause?.reason ||
        err?.shortMessage ||
        err?.message ||
        "Unknown error";

      if (err instanceof BaseError) {
        showStatusDialog("Error", rawReason);
        console.error("❌ Solidity Revert:", err.shortMessage || err.message);
      } else {
        showStatusDialog("Error", rawReason);
        console.error("❌ Unknown Error:", err);
      }
      throw new Error(rawReason);
    } finally {
      setIsLoading(false);
    }
  };
  return { cWrite };
};

const useReadContractHook = () => {
  const { showStatusDialog } = useCustomDialog();
  const { address: userAddress } = useAccount();
  const { setIsLoading } = useLoading();
  const cRead: cReadFunction = async (
    functionName: string,
    functionArgs: any[]
  ) => {
    try {
      setIsLoading(true);
      const data = readContract(rainbowKitConfig, {
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
        abi: GiftCardLogicABI.abi,
        functionName,
        args: functionArgs,
        account: userAddress,
      });
      return data;
    } catch (err: any) {
      const rawReason = err?.shortMessage || err?.message || "Unknown error";
      showStatusDialog("Error", rawReason);
      throw new Error(rawReason);
    } finally {
      setIsLoading(false);
    }
  };
  return { cRead };
};
