import { createContext, useContext, useState, ReactNode } from "react";

interface CustomDialogContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  message: string;
  setMessage: (message: string) => void;
  title: string;
  setTitle: (title: string) => void;
  image: string | undefined;
  setImage: (image: string | undefined) => void;
  hasCloseButton: boolean;
  setHasCloseButton: (hasCloseButton: boolean) => void;
  dialogType: "status" | "confirm" | "input" | undefined;
  setDialogType: (
    dialogType: "status" | "confirm" | "input" | undefined
  ) => void;
  onConfirm: ((result: boolean) => void) | undefined;
  setOnConfirm: (onConfirm: ((result: boolean) => void) | undefined) => void;
  onSubmitInput: ((input: any) => void) | undefined;
  setOnSubmitInput: (onSubmitInput: ((input: any) => void) | undefined) => void;
}

const CustomDialogContext = createContext<CustomDialogContextType | undefined>(
  undefined
);

export function CustomDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogType, setDialogType] = useState<
    "status" | "confirm" | "input" | undefined
  >(undefined);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<string | undefined>(undefined);
  const [hasCloseButton, setHasCloseButton] = useState(false);
  const [onConfirm, setOnConfirm] = useState<
    ((result: boolean) => void) | undefined
  >(undefined);

  const [onSubmitInput, setOnSubmitInput] = useState<
    ((input: any) => void) | undefined
  >(undefined);

  return (
    <CustomDialogContext.Provider
      value={{
        isOpen,
        setIsOpen,
        message,
        setMessage,
        dialogType,
        setDialogType,
        title,
        setTitle,
        image,
        setImage,
        hasCloseButton: hasCloseButton || false,
        setHasCloseButton,
        onConfirm,
        setOnConfirm,
        onSubmitInput,
        setOnSubmitInput,
      }}
    >
      {children}
    </CustomDialogContext.Provider>
  );
}

export function useCustomDialog() {
  const context = useContext(CustomDialogContext);
  if (context === undefined) {
    throw new Error(
      "useStatusDialog must be used within a StatusDialogProvider"
    );
  }

  const {
    title,
    message,
    isOpen,
    dialogType,
    image,
    hasCloseButton,
    setTitle,
    setMessage,
    setIsOpen,
    setHasCloseButton,
    setDialogType,
    setImage,
    setOnConfirm,
    setOnSubmitInput,
    onConfirm,
    onSubmitInput,
  } = context;

  const showStatusDialog = (
    title: string,
    message: string,
    hasCloseButton: boolean = false,
    image: string | undefined = undefined
  ) => {
    setTitle(title);
    setMessage(message);
    setIsOpen(true);
    setImage(image);
    setHasCloseButton(hasCloseButton || false);
    setDialogType("status");
  };

  const hideDialog = () => {
    setIsOpen(false);
    setMessage("");
    setDialogType(undefined);
  };

  const showConfirmDialog = (
    title: string,
    message: string,
    image: string | undefined = undefined
  ) => {
    setIsOpen(true);
    setTitle(title);
    setMessage(message);
    setImage(image);
    setDialogType("confirm");

    return new Promise((resolve) => {
      setOnConfirm(() => (result: boolean) => {
        resolve(result);
      });
    });
  };

  const showInputDialog = (
    title: string,
    message: string,
    image: string | undefined = undefined
  ) => {
    setIsOpen(true);
    setTitle(title);
    setMessage(message);
    setImage(image);
    setDialogType("input");
    return new Promise((resolve) => {
      setOnSubmitInput(() => (input: any) => {
        resolve(input);
      });
    });
  };

  return {
    title,
    message,
    image,
    hasCloseButton,
    isOpen,
    dialogType,
    showConfirmDialog,
    showStatusDialog,
    showInputDialog,
    hideDialog,
    onConfirm,
    onSubmitInput,
  };
}
