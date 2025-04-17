// App.tsx
import React from "react";
import { withAdminGuard } from "@/components/admin-guard";
import { Button, Typography } from "@mui/material";
import { useWalletConnection } from "@/contexts/walletConnectContext";
import { useCustomDialog } from "@/contexts/customDialogContext";
function WithdrawMoney() {
  const { userAddress, cWrite } = useWalletConnection();
  const { showStatusDialog, showConfirmDialog } = useCustomDialog();

  const onClickWithdraw = async () => {
    if (!userAddress) {
      showStatusDialog("Error", "Please connect to the network");
      return;
    }

    const answer = await showConfirmDialog(
      "Are you sure to withdraw money?",
      "Please ensure that you are the owner of the contract"
    );

    if (answer == true) {
      try {
        await cWrite("withdrawAllETH", []);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_err: any) {}
    }
  };

  return (
    <div className="App">
      <Typography
        variant="h4"
        component="h1"
        className="w-full bg-gradient-to-r from-red-200 to-red-400 p-3 mb-3"
      >
        Withdraw money
      </Typography>
      <div className="mt-5">
        <Button variant="contained" onClick={onClickWithdraw}>
          Withdraw
        </Button>
      </div>
    </div>
  );
}

export default withAdminGuard(WithdrawMoney);
