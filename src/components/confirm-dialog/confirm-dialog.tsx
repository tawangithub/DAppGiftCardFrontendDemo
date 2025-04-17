import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { useCustomDialog } from "@/contexts/customDialogContext";
import Image from "next/image";
const ConfirmDialog: React.FC = () => {
  const { isOpen, dialogType, title, message, image, onConfirm, hideDialog } =
    useCustomDialog();

  return (
    <Dialog
      open={isOpen && dialogType === "confirm"}
      onClose={undefined} // not allow to close by clicking outside
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      {image && (
        <div className="flex justify-center items-center mb-2 w-full">
          <Image
            src={image}
            alt="Confirm Dialog"
            width={300}
            height={300}
            className="rounded-md"
          />
        </div>
      )}
      <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
      <DialogContent className="max-w-[300px]">
        <DialogContentText id="confirm-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            if (onConfirm) {
              onConfirm(false);
              hideDialog();
            }
          }}
          color="primary"
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            if (onConfirm) {
              onConfirm(true);
              hideDialog();
            }
          }}
          color="primary"
          autoFocus
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
