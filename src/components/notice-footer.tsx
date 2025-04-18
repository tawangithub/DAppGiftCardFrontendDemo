import { Box, Typography } from "@mui/material";

const NoticeFooter = () => {
  const mockEthPriceInUSD = process.env.NEXT_PUBLIC_MOCK_ETH_PRICE_IN_USD;
  return (
    <>
      <Box
        component="footer"
        sx={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          backgroundColor: "red",
          color: "white",
          textAlign: "center",
          py: 2,
        }}
      >
        <Typography variant="body1">
          <span className="text-sm md:text-lg">
            Disclaimer: This is the mock app only for demo purpose.
            {mockEthPriceInUSD && (
              <span>
                A MATIC price is mocked to ${mockEthPriceInUSD} to allow testing
                with a low wallet balance on testnet.
              </span>
            )}
          </span>
        </Typography>
      </Box>
    </>
  );
};

export default NoticeFooter;
