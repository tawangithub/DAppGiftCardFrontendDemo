import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useCustomDialog } from "@/contexts/customDialogContext";
import Image from "next/image";
export function StatusDialog() {
  const {
    message,
    isOpen,
    dialogType,
    hideDialog,
    image,
    title,
    hasCloseButton,
  } = useCustomDialog();

  const images: any = {
    Confirmed: "/images/success.webp",
    Error: "/images/error.webp",
    Success: "/images/success.webp",
    Verifying: "/images/verifying.gif",
  };

  const resolvedImage = image || images[title];

  return (
    <Dialog
      open={isOpen && dialogType === "status"}
      onClose={hasCloseButton ? hideDialog : undefined}
      aria-labelledby="loading-dialog"
      BackdropProps={{
        style: {
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(10px)",
        },
      }}
      PaperProps={{
        style: {
          minWidth: 300,
          minHeight: 120,
        },
      }}
    >
      {resolvedImage && (
        <div className="flex justify-center items-center w-full">
          <Image
            src={resolvedImage}
            alt="Status Dialog"
            width={200}
            height={200}
            className="rounded-md"
          />
        </div>
      )}
      <DialogTitle className="text-center">
        {title}
        {hasCloseButton && (
          <IconButton
            aria-label="close"
            onClick={hideDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent className="max-w-[300px]">
        <div className="overflow-auto text-lg text-center text-black">
          {message}
        </div>
        <div className="flex justify-center mt-6 w-full">
          {["Confirmed", "Success", "Error"].includes(title) && (
            <Button
              className="w-full"
              variant="contained"
              color="primary"
              onClick={hideDialog}
            >
              OK
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
