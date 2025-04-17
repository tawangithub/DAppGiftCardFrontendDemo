import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../theme/theme";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { LoadingProvider } from "@/contexts/loading";
import Loading from "@/components/card-type-manager/Loading";
import MainLayout from "./layout/MainLayout";
import { WagmiProvider } from "wagmi";
import { rainbowKitConfig } from "../../wagmi.config";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@rainbow-me/rainbowkit/styles.css";
import { StatusDialog } from "@/components/status-dialog/status-dialog";
import { WalletConnectionProvider } from "@/contexts/walletConnectContext";
import ConfirmDialog from "@/components/confirm-dialog/confirm-dialog";
import { CustomDialogProvider } from "@/contexts/customDialogContext";
import InputDialog from "@/components/input-dialog/input-dialog";
function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  return (
    <ThemeProvider theme={theme}>
      <LoadingProvider>
        <CustomDialogProvider>
          <WagmiProvider config={rainbowKitConfig}>
            <QueryClientProvider client={queryClient}>
              <RainbowKitProvider>
                <WalletConnectionProvider>
                  <CssBaseline />
                  <Loading />
                  <MainLayout>
                    <StatusDialog />
                    <ConfirmDialog />
                    <InputDialog />
                    <Component {...pageProps} />
                  </MainLayout>
                </WalletConnectionProvider>
              </RainbowKitProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </CustomDialogProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
}

export default MyApp;
