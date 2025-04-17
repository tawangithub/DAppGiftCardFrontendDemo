import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import Image from "next/image";
export interface CardType {
  id: number;
  balanceInUSD: number;
  sellPriceInUSD: number;
  numberOfRemainingGiftCards: number;
  waitingAfterBuyInMonths: number;
  expireAfterBuyInYears: number;
}

interface ListCardFromShopProps {
  className?: string;
  cardTypes: CardType[];
  onClickItem?: (id: number, price: number) => void;
}

const ListCardFromShop = (props: ListCardFromShopProps) => {
  const { className, cardTypes, onClickItem } = props;
  return (
    <Box className={className}>
      {!cardTypes?.length && (
        <div className="text-center text-md text-gray-500 text-xl">
          No cards for sale on the shop yet.
        </div>
      )}

      <Grid container spacing={4}>
        {cardTypes.map((cardType) => {
          return (
            <Grid item xs={12} sm={12} md={6} lg={4} key={cardType.id}>
              <div className="mx-4 w-[300px]">
                <Card
                  className="relative w-[300px] h-[225px] lg:w-[300px] lg:h-[225px] cursor-pointer"
                  style={{
                    backgroundImage: "url('/images/giftcard.webp')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  onClick={() =>
                    onClickItem?.(cardType.id, cardType.sellPriceInUSD)
                  }
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

                <CardContent
                  className="flex flex-col space-y-1 mt-2"
                  style={{ paddingLeft: 0, paddingRight: 0 }}
                >
                  <div className="flex flex-row gap-2">
                    <div className="flex flex-col gap-2">
                      <Typography variant="body1" color="textPrimary">
                        <strong>Waiting Period: </strong>
                        <span className="text-sm">
                          {cardType.waitingAfterBuyInMonths} month(s){" "}
                        </span>
                      </Typography>
                      <Typography variant="body1" color="textPrimary">
                        <strong>Expired In: </strong>
                        <span className="text-sm">
                          {!cardType.expireAfterBuyInYears
                            ? "No expiration"
                            : `${cardType.expireAfterBuyInYears} year(s)`}
                        </span>
                      </Typography>

                      <Typography variant="body1" color="textPrimary">
                        <strong>Cards in stock:</strong>{" "}
                        {cardType.numberOfRemainingGiftCards}
                      </Typography>
                    </div>
                    <div className="ml-auto h-[100px]">
                      <Image
                        onClick={() =>
                          onClickItem?.(cardType.id, cardType.sellPriceInUSD)
                        }
                        className="cursor-pointer hover:scale-110 transition-transform duration-200"
                        src="/images/click-buy.webp"
                        alt="buy"
                        width={75}
                        height={75}
                      />
                    </div>
                  </div>
                </CardContent>
              </div>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ListCardFromShop;
