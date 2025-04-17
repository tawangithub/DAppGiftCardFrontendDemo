import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import { useCustomDialog } from "@/contexts/customDialogContext";
import Image from "next/image";
const InputDialog: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const {
    isOpen,
    dialogType,
    title,
    message,
    image,
    onSubmitInput,
    hideDialog,
  } = useCustomDialog();

  return (
    <Dialog
      open={isOpen && dialogType === "input"}
      onClose={undefined} // not allow to close by clicking outside
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      {image && (
        <div className="flex justify-center items-center mb-2 w-full">
          <Image
            src={image}
            alt="Confirm Dialog"
            width={320}
            height={320}
            className="rounded-md"
          />
        </div>
      )}
      <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
      <DialogContent className="max-w-[320px]">
        <DialogContentText id="confirm-dialog-description">
          {message}
        </DialogContentText>
        <div className="mt-3">
          <TextField
            className="w-full"
            autoFocus
            tabIndex={0}
            margin="dense"
            id="name"
            label=""
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            inputProps={{ autoComplete: "off" }}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            if (onSubmitInput) {
              onSubmitInput(undefined);
              setInputValue("");
              hideDialog();
            }
          }}
          color="primary"
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            if (onSubmitInput) {
              onSubmitInput(inputValue);
              setInputValue("");
              hideDialog();
            }
          }}
          color="primary"
          autoFocus
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InputDialog;
