/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { Box, Container, Pagination, Typography } from "@mui/material";
import { withWalletGuard } from "@/components/wallet-guard";
import useSWR from "swr";
import ListIssuedCards from "@/components/card-list/list-issued-cards";
import { peerCardsFetcher } from "@/api/fetch-buyable-peer-cards";
import { useRouter } from "next/router";
import { useWalletConnection } from "@/contexts/walletConnectContext";
import { getPriceInEthWithBuffer } from "@/util/util";
import { useCustomDialog } from "@/contexts/customDialogContext";

const BuyFromPeer = () => {
  const router = useRouter();
  const { userAddress, cWrite, cRead } = useWalletConnection();
  const [page, setPage] = useState(1);
  const { showStatusDialog, showConfirmDialog } = useCustomDialog();
  const { data, error, mutate } = useSWR(
    userAddress ? ["getCardTypesFromPeer", userAddress] : null,
    () => peerCardsFetcher(page, userAddress, cRead)
  );

  useEffect(() => {
    mutate();
  }, [page]);

  const buyableCards = (data as any)?.giftCards;
  const total = (data as any)?.total;

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

  if (!buyableCards) {
    return null;
  }

  const handleClickItem = async (id: number, priceInUSD: number) => {
    if (!userAddress) {
      showStatusDialog("Error", "Please connect your wallet");
      return;
    }

    const ans = await showConfirmDialog(
      "Confirm Purchase",
      `Are you sure to buy this giftcard at $${priceInUSD}`,
      "/images/buy.webp"
    );
    if (!ans) return;

    try {
      const totalPriceInEth = await getPriceInEthWithBuffer(priceInUSD);
      await cWrite(
        "buyTheResoldGiftCard",
        [id],
        ethers.parseEther(parseFloat(totalPriceInEth).toFixed(7))
      );

      mutate();
      router.push("/customer/my-cards");
    } catch (error) {
      console.error("Error buying card:", error);
    }
  };
  const pageCount = Math.ceil((total || 0) / 5);

  return (
    <Container className="mt-5 mb-10">
      <div className="mt-5 mb-10 lg:text-4xl p-3 text-2xl bg-gradient-to-r from-blue-200 to-blue-400 p-3">
        Buy 2nd Hand Gift Cards from Other Customers
      </div>
      <ListIssuedCards
        className="mt-10 mb-10"
        issuedCards={buyableCards}
        onClickItem={handleClickItem}
        editable={false}
        disableOwnCard={userAddress}
      />
      {!total && (
        <div className="mt-10 mb-10 text-gray-500 text-center text-xl">
          No 2nd hand cards for sale
        </div>
      )}
      <Box display="flex" justifyContent="center" mt={4}>
        {pageCount > 0 && (
          <Pagination
            count={pageCount}
            color="primary"
            page={page}
            onChange={(event, value) => {
              setPage(value);
            }}
          />
        )}
      </Box>
    </Container>
  );
};

export default withWalletGuard(BuyFromPeer);
