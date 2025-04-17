import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { useRouter } from "next/router";
import { useWalletConnection } from "@/contexts/walletConnectContext";
import { useCustomDialog } from "@/contexts/customDialogContext";
import Link from "next/link";
import Image from "next/image";
import TransferWithinAStationIcon from "@mui/icons-material/Send";
import RedeemIcon from "@mui/icons-material/Redeem";
import SellIcon from "@mui/icons-material/Sell";
import AdjustIcon from "@mui/icons-material/CurrencyExchange";
export interface GiftCard {
  id: number;
  balanceInUSD: number;
  sellPriceInUSD: number;
  sellable: boolean;
  startDate: number;
  expirationDate: number;
  owner: string;
}

interface ListIssuedCardsProps {
  className?: string;
  issuedCards: GiftCard[];
  onClickItem?: (id: number, price: number) => void;
  toggleSellable?: (id: number, sellable: boolean) => void;
  transferCard?: (id: number) => void;
  adjustPrice?: (id: number) => void;
  editable?: boolean;
  disableOwnCard?: string;
}

const ListIssuedCards = (props: ListIssuedCardsProps) => {
  const {
    className,
    issuedCards = [],
    onClickItem,
    toggleSellable,
    transferCard,
    adjustPrice,
    disableOwnCard,
  } = props;
  const router = useRouter();
  const { userAddress } = useWalletConnection();
  const { showStatusDialog } = useCustomDialog();
  return (
    <Box className={className}>
      {issuedCards.length === 0 && !disableOwnCard && (
        <div className="flex flex-col justify-center items-center">
          <div className="text-center text-gray-500 text-xl">
            No gift cards belong to your account yet
          </div>
          <div className="mt-5">
            <Link href="/customer/buy-from-shop">
              <div className="mt-10 flex justify-center items-center">
                <Button
                  component="a"
                  href="/customer/buy-from-shop"
                  style={{ padding: 0 }}
                >
                  <Image
                    src="/images/shop.webp"
                    alt="Buy cards from shop"
                    width={100}
                    height={100}
                    className="hover:opacity-90 transition duration-300"
                  />
                  <div className="ml-3 text-center text-2xl">
                    Buy card from shop
                  </div>
                </Button>
              </div>
            </Link>
          </div>
        </div>
      )}
      <Grid container spacing={4}>
        {issuedCards.map((giftCard: GiftCard) => {
          const activeFrom = new Date(
            Number(giftCard.startDate) * 1000
          ).toLocaleDateString();
          let activeTo;
          if (giftCard.expirationDate > 0) {
            activeTo = new Date(
              Number(giftCard.expirationDate) * 1000
            ).toLocaleDateString();
          } else {
            activeTo = "no expiration";
          }

          return (
            <Grid item xs={12} sm={12} md={6} lg={4} key={giftCard.id}>
              <div className="mx-4 w-[300px] flex flex-col justify-center mx-auto">
                <Card
                  className="mx-auto relative w-[300px] h-[225px] lg:w-[300px] lg:h-[225px] cursor-pointer"
                  style={{
                    backgroundImage: "url('/images/giftcard.webp')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity:
                      disableOwnCard && giftCard.owner == userAddress ? 0.5 : 1,
                  }}
                  onClick={() => {
                    if (disableOwnCard && giftCard.owner == userAddress) {
                      showStatusDialog(
                        "Error",
                        "You cannot select your own card"
                      );
                      return;
                    }
                    onClickItem?.(giftCard.id, giftCard.sellPriceInUSD);
                  }}
                >
                  <CardContent>
                    {giftCard.sellable && (
                      <div className="bg-red-500 text-white px-2 py-1 rounded-l-full absolute top-2 right-0">
                        To Sell at ${giftCard.sellPriceInUSD}
                      </div>
                    )}
                    <Typography
                      className="absolute bottom-[30px] left-[40px] text-md"
                      color="textPrimary"
                    >
                      {`ID: ${giftCard.id.toString().padStart(7, "0")}`}
                    </Typography>
                    <Typography
                      className="absolute bottom-[30px] right-[40px] text-md"
                      color="textPrimary"
                    >
                      {`Balance $${giftCard.balanceInUSD}`}
                    </Typography>
                  </CardContent>
                </Card>
                <CardContent className="flex flex-col space-y-1 mt-0 justify-center items-center">
                  {(!disableOwnCard || giftCard.owner != userAddress) && (
                    <div className="mb-3">
                      <Typography variant="body1" color="textPrimary">
                        <strong>Redeemable:</strong>{" "}
                        <span className="text-sm">
                          {activeFrom} <strong>-</strong> {activeTo}
                        </span>
                      </Typography>
                    </div>
                  )}
                  {disableOwnCard && giftCard.owner == userAddress && (
                    <div className="w-[150px] text-center text-white bg-red-500 rounded-full px-2 py-1">
                      Your own card
                    </div>
                  )}
                  {props.editable && (
                    <div className="flex flex-col gap-2 w-[300px]">
                      {!giftCard.sellable && (
                        <div className="flex flex-row gap-2">
                          <Button
                            className="rounded-full w-1/2"
                            variant="contained"
                            color="primary"
                            onClick={() => transferCard?.(giftCard.id)}
                            startIcon={<TransferWithinAStationIcon />}
                          >
                            Transfer
                          </Button>
                          <Button
                            className="rounded-full w-1/2"
                            variant="contained"
                            color="success"
                            onClick={() =>
                              router.push(
                                `/customer/gen-voucher/${giftCard.id}`
                              )
                            }
                            startIcon={<RedeemIcon />}
                          >
                            Redeem
                          </Button>
                        </div>
                      )}
                      <Button
                        className="rounded-full w-full"
                        variant="contained"
                        startIcon={<SellIcon />}
                        color={giftCard.sellable ? "error" : "warning"}
                        onClick={() =>
                          toggleSellable?.(giftCard.id, !giftCard.sellable)
                        }
                      >
                        {giftCard.sellable ? "Remove from sale" : "To Sell"}
                      </Button>
                      {giftCard.sellable && (
                        <Button
                          className="rounded-full w-full"
                          variant="contained"
                          color="primary"
                          onClick={() => adjustPrice?.(giftCard.id)}
                          startIcon={<AdjustIcon />}
                        >
                          Adjust price
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </div>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ListIssuedCards;
