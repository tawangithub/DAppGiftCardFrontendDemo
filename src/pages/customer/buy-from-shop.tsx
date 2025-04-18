import React from "react";
import { ethers } from "ethers";

import { cardTypesFetcher } from "../../api/fetch-card-type";
import { withWalletGuard } from "@/components/wallet-guard";
import useSWR from "swr";
import ListCardFromShop from "@/components/card-list/list-cards-in-shop.component";
import { useRouter } from "next/router";
import { useWalletConnection } from "@/contexts/walletConnectContext";
import { useCustomDialog } from "@/contexts/customDialogContext";
import { getPriceInEthWithBuffer } from "@/util/util";
import { Container, Typography } from "@mui/material";
const BuyFromShop = () => {
  const { userAddress, cRead, cWrite } = useWalletConnection();
  const { showInputDialog } = useCustomDialog();
  const router = useRouter();
  const {
    data: cardTypes,
    error,
    mutate,
  } = useSWR(userAddress ? ["getCardTypesFromShop", userAddress] : null, () =>
    cardTypesFetcher(userAddress, cRead)
  );
  const { showStatusDialog } = useCustomDialog();

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

  if (!cardTypes) {
    return null;
  }

  const handleClickItem = async (id: number, priceInUSD: number) => {
    const numberOfCards = await showInputDialog(
      "Card Purchase",
      `How many cards would you like to purchase? (Price: $${priceInUSD} each)`,
      "/images/buy.webp"
    );

    if (numberOfCards && userAddress) {
      const numberOfCardsInt = parseInt(numberOfCards as any);
      if (numberOfCardsInt > 0) {
        const totalPriceInUSD = Number(priceInUSD) * Number(numberOfCardsInt);

        try {
          showStatusDialog(
            "Loading...",
            `Fetching Price current price of ETH....`
          );
          const totalPriceInEth = await getPriceInEthWithBuffer(
            totalPriceInUSD
          );
          showStatusDialog(
            "Verifying",
            `Please confirm with your wallet to buy ${numberOfCardsInt} cards for $${totalPriceInUSD}`
          );

          await cWrite(
            "buyGiftCardFromShop",
            [id, numberOfCardsInt],
            ethers.parseEther(parseFloat(totalPriceInEth).toFixed(7))
          );

          mutate();
          router.push("/customer/my-cards");
        } catch (_error: any) {
          console.log(_error);
        }
      }
    }
  };

  return (
    <Container className="mt-5 mb-10">
      <div className="mt-5 mb-10 p-3 lg:text-4xl text-xl bg-gradient-to-r from-pink-200 to-pink-400">
        Buy Gift Cards from Official Shop
      </div>
      <ListCardFromShop
        className="mt-10 mb-10"
        cardTypes={cardTypes}
        onClickItem={handleClickItem}
      />
    </Container>
  );
};

export default withWalletGuard(BuyFromShop);
