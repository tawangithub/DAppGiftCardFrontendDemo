import React from "react";
import { Container, Typography } from "@mui/material";
import { withWalletGuard } from "@/components/wallet-guard";
import useSWR from "swr";
import { myCardsFetcher } from "@/api/fetch-my-cards";
import ListIssuedCards from "@/components/card-list/list-issued-cards";
import { useWalletConnection } from "@/contexts/walletConnectContext";
import { useCustomDialog } from "@/contexts/customDialogContext";

const MyCards = () => {
  const { userAddress, web3, cRead, cWrite } = useWalletConnection();
  const { showStatusDialog, showInputDialog, showConfirmDialog } =
    useCustomDialog();
  const {
    data: myCards,
    error,
    mutate,
  } = useSWR(userAddress ? ["getMyCards", userAddress] : null, () =>
    myCardsFetcher(userAddress, cRead)
  );

  if (error) {
    console.error("Error fetching card types:", error);
    return (
      <Container className="mt-5 mb-10">
        <Typography variant="h6" color="error">
          Error loading cards. Please try again later.
        </Typography>
      </Container>
    );
  }

  if (!myCards) {
    return null;
  }

  const toggleSellable = async (id: number, sellable: boolean) => {
    let sellPrice = 0;
    const isConfirmed = await showConfirmDialog(
      "Sell Card",
      sellable
        ? "Do you want to put this card up for sale? It will be visible on the marketplace and available for purchase by other customers."
        : "Do you want to remove this card from the marketplace?",
      sellable ? "/images/sell.webp" : "/images/remove.webp"
    );
    if (!isConfirmed) return;
    if (sellable == true) {
      const answer = await showInputDialog(
        "Sell Price Adjustment",
        "Enter the sell price in USD",
        "/images/sell.webp"
      );
      if (answer == "" || answer == null) return;
      sellPrice = Number(answer);
      if (isNaN(sellPrice) || sellPrice == 0) {
        showStatusDialog("Error", "Invalid sell price");
        return;
      }
    }
    try {
      await cWrite("setSellable", [
        id,
        sellable,
        sellPrice ? sellPrice * 100 : 0,
      ]);
      mutate();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      //error already handle in the cWrite hook
    }
  };

  const transferCard = async (id: number) => {
    try {
      const receivedAddress = await showInputDialog(
        "Transfer Card",
        "Enter the account address you want to transfer this giftcard to",
        "/images/transfer.webp"
      );
      if (receivedAddress == null) return;

      if (!receivedAddress) {
        showStatusDialog("Error", "Invalid received address");
        return;
      }

      await cWrite("safeTransferFrom", [
        userAddress || "",
        receivedAddress,
        id,
        web3?.utils.asciiToHex(""),
      ]);
      mutate();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      /**
       *already handled error in the cWrite hook
       */
    }
  };

  const adjustPrice = async (id: number) => {
    let newPrice: any = await showInputDialog(
      "Price Adjustment",
      "Enter the new price to adjust (in USD)",
      "/images/adjust.webp"
    );

    if (newPrice == null || newPrice == "") return;
    newPrice = Number(newPrice);
    if (isNaN(newPrice) || newPrice <= 0) {
      showStatusDialog("Error", "Invalid new price");
      return;
    }
    try {
      await cWrite("setSellPrice", [id, Math.round(newPrice * 100)]);
      mutate();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      /**
       *already handled error in the cWrite hook
       */
    }
  };

  return (
    <Container className="mt-5 mb-10">
      <div className="mt-5 mb-10 lg:text-4xl p-3 text-2xl bg-gradient-to-r from-green-400 to-green-600">
        My Current Cards
      </div>
      <ListIssuedCards
        className="mt-10 mb-10"
        issuedCards={myCards}
        toggleSellable={toggleSellable}
        transferCard={transferCard}
        adjustPrice={adjustPrice}
        editable={true}
      />
    </Container>
  );
};

export default withWalletGuard(MyCards);
