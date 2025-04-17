// App.tsx
import React from "react";
import QrScanner from "../../components/qr-scanner/qr-scanner";
import { withAdminGuard } from "@/components/admin-guard";
import Web3 from "web3";
import { useWalletConnection } from "@/contexts/walletConnectContext";
import { useCustomDialog } from "@/contexts/customDialogContext";

function RedeemVoucher() {
  const { userAddress, web3, cWrite, cRead } = useWalletConnection();
  const { showStatusDialog } = useCustomDialog();
  const handleScanSuccess = async (scannedText: string) => {
    if (!userAddress) {
      showStatusDialog("Error", "Please connect to the network");
      return;
    }
    const parsedText = JSON.parse(scannedText);
    const voucherId = BigInt(parsedText.voucherId);
    const cardId = Number(parsedText.cardId);
    const amount_e2 = Number(parsedText.amount_e2);
    const expiredAtTimestamp = Number(parsedText.expiredAtTimestamp);
    const signature = parsedText.signature;
    const signer = parsedText.signer;
    let cardOwnerAddress = "";
    try {
      cardOwnerAddress = await cRead("ownerOf", [cardId]);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err: any) {
      showStatusDialog(
        "Error",
        "The Voucher is invalid. Please generate a new one and try again"
      );
      return;
    }

    const isValidSignature = validateSignature(
      web3,
      voucherId,
      cardId,
      amount_e2,
      signature,
      web3?.utils.toChecksumAddress(signer || "") || "",
      expiredAtTimestamp,
      cardOwnerAddress
    );

    if (!isValidSignature) {
      showStatusDialog(
        "Error",
        "The Voucher is invalid. Please generate a new one and try again"
      );
    } else {
      if (Date.now() > expiredAtTimestamp) {
        showStatusDialog("Error", "The QR code has expired.");
        return;
      }
      try {
        await cWrite("redeemGiftCard", [cardId, amount_e2, voucherId]);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_err: any) {
        //alredy handle erorr in cWrite
      }
    }
  };

  return (
    <div className="App">
      <QrScanner onScanSuccess={handleScanSuccess} />
    </div>
  );
}

function validateSignature(
  web3: Web3 | null,
  voucherId: bigint,
  cardId: number,
  amount_e2: number,
  signature: string,
  userAddress: string,
  expiredAtTimestamp: number,
  cardOwnerAddress: string
) {
  if (!web3) return false;
  const message = web3.utils.soliditySha3(
    { type: "uint256", value: Number(cardId) },
    { type: "uint256", value: amount_e2 }, // USD_e2
    { type: "address", value: userAddress },
    { type: "uint256", value: voucherId },
    { type: "uint256", value: expiredAtTimestamp }
  );
  const recoveredAddress = web3.eth.accounts.recover(message || "", signature);

  // ensure that the signer and the card owner
  return (
    recoveredAddress.toLowerCase() === userAddress.toLowerCase() &&
    cardOwnerAddress.toLowerCase() == userAddress.toLowerCase()
  );
}

export default withAdminGuard(RedeemVoucher);
