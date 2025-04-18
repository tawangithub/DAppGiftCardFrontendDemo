import React from "react";
import { Button, TextField, Typography, Container } from "@mui/material";
import { useForm } from "react-hook-form";

export type CreateNewGiftCardTypeFormData = {
  balanceInUSD: string;
  sellPriceInUSD: string;
  numberOfCards: string;
  waitingPeriodInMonths: string;
  expireInYears: string;
};

interface CreateNewGiftCardTypeProps {
  isShowForm: boolean;
  setIsShowForm: (isShowForm: boolean) => void;
  onSubmitHandler: (data: CreateNewGiftCardTypeFormData) => void;
}

const CreateNewGiftCardType = (props: CreateNewGiftCardTypeProps) => {
  const { onSubmitHandler, isShowForm, setIsShowForm } = props;

  const onSubmit = async (data: CreateNewGiftCardTypeFormData) => {
    await onSubmitHandler(data);
    reset();
  };
  const handleGenerateClick = () => {
    setIsShowForm(true);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateNewGiftCardTypeFormData>();

  return (
    <Container className="mt-8 p-8 bg-gray-100 rounded-lg shadow-md">
      {isShowForm && (
        <Typography variant="h4" gutterBottom>
          <span className="text-xl md:text-3xl">New Gift Card Type</span>
        </Typography>
      )}
      {!isShowForm && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerateClick}
          className="mt-4"
        >
          Add A New Gift Cards Type
        </Button>
      )}
      {isShowForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-5"
        >
          <TextField
            label="Balance in USD"
            type="number"
            {...register("balanceInUSD", { required: true, min: 1 })}
            fullWidth
            className="mb-4"
            error={!!errors.balanceInUSD}
            helperText={
              errors.balanceInUSD ? "Balance must be greater than 0" : ""
            }
          />
          <TextField
            label="Sell price in USD"
            type="number"
            inputProps={{ step: 0.01 }}
            {...register("sellPriceInUSD", { required: true, min: 0.01 })}
            fullWidth
            className="mb-4"
            error={!!errors.sellPriceInUSD}
            helperText={
              errors.sellPriceInUSD ? "Sell price must be greater than 0" : ""
            }
          />
          <TextField
            label="Number of Gift Cards in Stock"
            type="number"
            {...register("numberOfCards", { required: true, min: 1 })}
            fullWidth
            className="mb-4"
            error={!!errors.numberOfCards}
            helperText={
              errors.numberOfCards
                ? "Number of cards must be greater than 0"
                : ""
            }
          />
          <TextField
            label="Waiting Period in Months"
            type="number"
            {...register("waitingPeriodInMonths", { required: true, min: 0 })}
            fullWidth
            className="mb-4"
            error={!!errors.waitingPeriodInMonths}
            helperText={
              errors.waitingPeriodInMonths
                ? "Waiting period cannot be negative"
                : ""
            }
          />
          <TextField
            label="Expire in Years"
            type="number"
            {...register("expireInYears", { required: true, min: 0 })}
            fullWidth
            className="mb-4"
            error={!!errors.expireInYears}
            helperText={
              errors.expireInYears ? "Expire period must be greater than 0" : ""
            }
          />
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            className="mt-4"
            disabled={Object.keys(errors).length > 0}
          >
            Submit
          </Button>
        </form>
      )}
    </Container>
  );
};

export default CreateNewGiftCardType;
