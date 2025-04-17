import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import useSWR from "swr";
import { fetchCardDetail } from "@/api/fetch-card-detail";
import { generateUniqueVoucherId } from "@/util/util";
import QRCode from "qrcode";
import Image from "next/image";
import { useWalletConnection } from "@/contexts/walletConnectContext";
import { useCustomDialog } from "@/contexts/customDialogContext";
const GenerateVoucher = () => {
  const router = useRouter();
  const { id } = router.query;
  const { userAddress, web3, cRead } = useWalletConnection();
  const [qrExpiredAt, setQrExpiredAt] = useState<Date | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const { showStatusDialog } = useCustomDialog();
  const { data, error } = useSWR(
    userAddress && id != null ? ["viewGiftCard", userAddress] : null,
    () => fetchCardDetail(Number(id), cRead)
  );

  const cardDetail = data;

  if (error) {
    console.error("Error fetching card types:", error);
    return (
      <Container className="mt-5 mb-10">
        <Typography variant="h6" color="error">
          Error loading card. Please try again later.
        </Typography>
      </Container>
    );
  }

  if (!cardDetail) {
    return null;
  }

  if (!cardDetail) {
    return (
      <Container className="mt-5 mb-10">
        <Typography variant="h6" color="error">
          Card not found.
        </Typography>
      </Container>
    );
  }

  const handleGenerateQRCode = async () => {
    if (!web3) {
      showStatusDialog("Error", "Please connect your wallet.");
      return;
    }
    if (amount && amount > 0 && amount <= cardDetail.balanceInUSD) {
      const expiredAtTimestamp = new Date().getTime() + 1000 * 60 * 5;
      const voucherId = generateUniqueVoucherId(cardDetail.id);
      const message = web3.utils.soliditySha3(
        { type: "uint256", value: Number(id) },
        { type: "uint256", value: Math.round(amount * 100) }, // amount in USD_e2
        { type: "address", value: userAddress },
        { type: "uint256", value: voucherId },
        { type: "uint256", value: expiredAtTimestamp }
      );

      // Sign the message
      const signature = await web3.eth.personal.sign(
        message || "",
        userAddress || "",
        ""
      );
      const qrData = JSON.stringify({
        voucherId: voucherId.toString(),
        cardId: cardDetail.id.toString(),
        amount_e2: Math.round(amount * 100).toString(),
        signer: userAddress,
        expiredAtTimestamp: expiredAtTimestamp.toString(),
        signature,
      });
      const qrCode = await QRCode.toDataURL(qrData);
      setQrCode(qrCode);
      setQrExpiredAt(new Date(expiredAtTimestamp));
    } else {
      if (amount != null && amount > cardDetail.balanceInUSD) {
        showStatusDialog("Error", "Insufficient balance.");
      } else {
        showStatusDialog("Error", "Please enter a valid amount to redeem.");
      }
    }
  };

  const activeFrom = new Date(
    Number(cardDetail.startDate) * 1000
  ).toLocaleDateString();
  let activeTo;
  if ((cardDetail.expirationDate as any) > 0) {
    activeTo = new Date(
      Number(cardDetail.expirationDate) * 1000
    ).toLocaleDateString();
  } else {
    activeTo = "no expiration";
  }

  return (
    <Container className="mt-5 mb-10 flex flex-col space-y-5 items-center">
      <Card
        className="relative w-[300px] h-[225px] lg:w-[300px] lg:h-[225px]"
        style={{
          backgroundImage: "url('/images/giftcard.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <CardContent>
          <Typography
            className="absolute bottom-[30px] left-[40px] text-md font-bold"
            color="textPrimary"
          >
            <strong>
              {" "}
              {`ID: ${cardDetail.id.toString().padStart(7, "0")}`}
            </strong>
          </Typography>
          <Typography
            className="absolute bottom-[30px] right-[40px] text-md font-bold"
            color="textPrimary"
          >
            <strong> {`Balance $${cardDetail.balanceInUSD}`}</strong>
          </Typography>
        </CardContent>
      </Card>
      <Typography variant="body1" color="textPrimary">
        <strong>Redeemable Period: </strong>
        <span className="text-sm">
          {activeFrom} <strong>-</strong> {activeTo}
        </span>
      </Typography>
      <TextField
        label="Amount to Redeem in USD"
        type="number"
        value={amount || ""}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="mt-5 w-[300px]"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleGenerateQRCode}
        className="mt-5 w-[300px]"
      >
        Generate QR Code
      </Button>
      {qrCode && (
        <>
          <div className="flex flex-col items-center max-w-[550px] my-5 p-5 rounded-lg bg-gradient-to-r from-blue-200 to-blue-400">
            <Typography variant="h6" color="textPrimary">
              Scan the below QR Code at the shop to redeem your ${amount}{" "}
              voucher
            </Typography>
            <div className="mt-1 text-left">
              Note: After the QR code is scanned, the voucher will be redeemed.
              Then the balance of the giftcard will be reduced by the amount of
              the voucher.
            </div>
          </div>
          <div className="flex items-center max-w-[550px] my-5 p-5 rounded-lg bg-gradient-to-r from-blue-200 to-blue-400">
            <Image src={qrCode} alt="QR Code" width={200} height={200} />
            <div className="mt-5">
              <Typography variant="h6" className="text-center px-4">
                QR Code will be valid until: {qrExpiredAt?.toLocaleTimeString()}
              </Typography>
            </div>
          </div>
        </>
      )}
    </Container>
  );
};

export default GenerateVoucher;
