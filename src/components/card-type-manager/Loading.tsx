import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import { useLoading } from "../../contexts/loading";

const Loading: React.FC = () => {
  const { isLoading } = useLoading();
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
      open={isLoading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loading;
