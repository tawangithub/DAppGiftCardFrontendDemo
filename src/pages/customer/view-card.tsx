import React, { useState } from "react";
import { Container, Box, Button, TextField } from "@mui/material";
import { withWalletGuard } from "@/components/wallet-guard";
import { useWalletConnection } from "@/contexts/walletConnectContext";
import ViewCard from "@/components/card-list/view-card";
import { fetchCardDetail } from "@/api/fetch-card-detail";
import { GiftCard } from "@/components/card-list/list-issued-cards";

const ViewCardPage = () => {
  const { cRead } = useWalletConnection();
  const [id, setId] = useState<string | null>(null);
  const [giftCard, setGiftCard] = useState<GiftCard | null>(null);

  return (
    <Container className="mt-5 mb-10">
      {!giftCard && (
        <Box
          textAlign="center"
          mt={5}
          className="flex justify-center items-center"
        >
          <TextField
            type="text"
            placeholder="Enter Card ID"
            value={id || ""}
            onChange={(e) => setId(e.target.value)}
            variant="outlined"
            style={{ padding: "10px", fontSize: "16px", marginRight: "10px" }}
          />
          <Button
            variant="contained"
            color="primary"
            className="h-10"
            onClick={() => {
              if (id) {
                fetchCardDetail(Number(id), cRead).then((data: any) => {
                  setGiftCard(data);
                });
              }
            }}
          >
            View
          </Button>
        </Box>
      )}
      {giftCard && (
        <Box textAlign="center" my={10}>
          <ViewCard giftCard={giftCard} />
        </Box>
      )}
    </Container>
  );
};

export default withWalletGuard(ViewCardPage);
