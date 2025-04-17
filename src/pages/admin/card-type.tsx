import ListCardType from "@/components/card-type-manager/list-card-type.component";
import { Box, Container, Typography } from "@mui/material";
import useSWR from "swr";
import CreateNewGiftCardType, {
  CreateNewGiftCardTypeFormData,
} from "@/components/card-type-manager/create-new-card-type.component";
import { useState } from "react";
import { cardTypesFetcher } from "@/api/fetch-card-type";
import { withAdminGuard } from "@/components/admin-guard";
import { useWalletConnection } from "@/contexts/walletConnectContext";
import { useCustomDialog } from "@/contexts/customDialogContext";

const ListGiftCardTypePage = () => {
  const { userAddress, cRead, cWrite } = useWalletConnection();
  const [isShowCreateForm, setIsShowCreateForm] = useState(false);
  const { showInputDialog } = useCustomDialog();
  const {
    data: cardTypes,
    error,
    mutate,
  } = useSWR(userAddress ? ["getCardTypesByShop", userAddress] : null, () =>
    cardTypesFetcher(userAddress, cRead)
  );

  const onSubmit = async (data: CreateNewGiftCardTypeFormData) => {
    try {
      console.log("x0");
      await cWrite(
        "createNewGiftCardTypeByShop",
        [
          Number(data.numberOfCards),
          Number(data.waitingPeriodInMonths),
          Number(data.expireInYears),
          Number(data.balanceInUSD) * 100,
          Number(data.sellPriceInUSD) * 100,
        ],
        undefined
      );

      setIsShowCreateForm(false);
      mutate();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err: any) {
      //alredy handle erorr in cWrite
    }
  };

  const onEditItemStock = async (id: number) => {
    const newStockNumber = await showInputDialog(
      "Stock Adjustment",
      "Enter the new total quantity of cards in stock",
      "/images/adjust.webp"
    );
    if (newStockNumber != undefined) {
      try {
        await cWrite(
          "setNumberOfRemainingGiftCards",
          [id, newStockNumber],
          undefined
        );

        mutate();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_err: any) {
        //alredy handle erorr in cWrite
      }
    }
  };

  if (error) {
    console.error("Error fetching card types:", error);
    return <div>Error loading card types. Please try again later.</div>;
  }

  if (!cardTypes) {
    return null;
  }

  return (
    <Container className="mt-5 mb-10">
      <Box
        className="mt-5"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={4}
      >
        <Typography
          variant="h4"
          component="h1"
          className="w-full bg-gradient-to-r from-red-200 to-red-400 p-3"
        >
          Card Type Manager
        </Typography>
      </Box>
      <CreateNewGiftCardType
        isShowForm={isShowCreateForm}
        setIsShowForm={setIsShowCreateForm}
        onSubmitHandler={onSubmit}
      />
      <ListCardType
        className="mt-10"
        cardTypes={cardTypes}
        onEditItemStock={onEditItemStock}
        editable={true}
      />
    </Container>
  );
};

export default withAdminGuard(ListGiftCardTypePage);
