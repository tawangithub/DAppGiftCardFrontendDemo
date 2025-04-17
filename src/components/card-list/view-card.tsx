import React from "react";
import { Container, Typography, Box } from "@mui/material";
import { GiftCard } from "./list-issued-cards";
import Image from "next/image";
interface ViewCardProps {
  giftCard: GiftCard;
}
const ViewCard: React.FC<ViewCardProps> = (props: ViewCardProps) => {
  const { giftCard } = props;
  if (!giftCard) return null;
  return (
    <Container className="mt-5 mb-10">
      <Box textAlign="center" mt={10}>
        <div className="flex justify-center mb-5">
          <Image
            src="/images/giftcard.webp"
            width={300}
            height={255}
            alt="Gift card"
          />
        </div>
        <Typography variant="h6">
          Card ID: {giftCard.id.toString().padStart(7, "0")}
        </Typography>
        <Typography variant="h6">
          Balance Left: $USD {Number(giftCard.balanceInUSD).toFixed(2)}
        </Typography>
        {giftCard.sellable && (
          <Typography variant="body1" gutterBottom>
            Sell price: $USD {Number(giftCard.sellPriceInUSD).toFixed(2)}
          </Typography>
        )}
        <Typography variant="body2" gutterBottom>
          Redeemable from: {giftCard.startDate.toLocaleString()}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Expiry Date:{" "}
          {giftCard.expirationDate
            ? giftCard.expirationDate.toLocaleString()
            : "no expiry date"}
        </Typography>
      </Box>
    </Container>
  );
};

export default ViewCard;
