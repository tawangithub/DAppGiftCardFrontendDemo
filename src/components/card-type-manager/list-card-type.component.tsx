import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

export interface CardType {
  id: number;
  balanceInUSD: number;
  sellPriceInUSD: number;
  numberOfRemainingGiftCards: number;
  waitingAfterBuyInMonths: number;
  expireAfterBuyInYears: number;
}

interface ListCardTypeProps {
  className?: string;
  cardTypes: CardType[];
  onEditItemStock?: (id: number) => void;
  editable?: boolean;
}

const ListCardType = (props: ListCardTypeProps) => {
  const { className, cardTypes, onEditItemStock, editable } = props;
  return (
    <Box className={className}>
      <Grid container spacing={4}>
        {cardTypes.map((cardType) => (
          <Grid item xs={12} sm={12} md={6} lg={4} key={cardType.id}>
            <div className="mx-4">
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
                    <strong> {`Balance $${cardType.balanceInUSD}`}</strong>
                  </Typography>
                  <Typography
                    variant="body2"
                    color="black"
                    className="absolute bottom-[30px] right-[40px]"
                  >
                    Price ${`${cardType.sellPriceInUSD}`}
                  </Typography>
                </CardContent>
              </Card>
              <CardContent className="flex flex-col space-y-1 mt-2">
                <Typography variant="body1" color="textPrimary">
                  <strong>Waiting period:</strong>{" "}
                  {cardType.waitingAfterBuyInMonths} month(s)
                </Typography>
                <Typography variant="body1" color="textPrimary">
                  <strong>Expire after purchase:</strong>{" "}
                  {cardType.expireAfterBuyInYears == 0
                    ? "No expiration"
                    : `${cardType.expireAfterBuyInYears} year(s)`}
                </Typography>
                <Typography variant="body1" color="textPrimary">
                  <strong>Cards in stock:</strong>{" "}
                  {cardType.numberOfRemainingGiftCards}
                  {editable && (
                    <IconButton
                      aria-label="edit"
                      onClick={() => {
                        if (onEditItemStock) onEditItemStock(cardType.id);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}
                </Typography>
              </CardContent>
            </div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ListCardType;
