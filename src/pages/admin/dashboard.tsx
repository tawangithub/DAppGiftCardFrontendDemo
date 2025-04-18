import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import Link from "next/link";
import { withAdminGuard } from "@/components/admin-guard";

const AdminDashboard = () => {
  return (
    <div>
      <Container className="mt-5 mb-10">
        <Box textAlign="center" mt={10}>
          <Typography variant="h3" gutterBottom className="hidden md:block">
            Welcome to the Admin Dashboard
          </Typography>
          <Typography variant="h5" gutterBottom>
            Choose an action to proceed
          </Typography>
          <Box mt={5} className="flex flex-col gap-4">
            <Link href="/admin/card-type">
              <Button
                className="w-full md:w-1/2"
                variant="contained"
                color="primary"
                size="large"
              >
                Manage Gift Card Types
              </Button>
            </Link>
            <Link href="/admin/redeem-voucher">
              <Button
                className="w-full md:w-1/2"
                variant="contained"
                color="secondary"
                size="large"
              >
                Redeem Voucher
              </Button>
            </Link>
            <Link href="/admin/withdraw">
              <Button
                className="w-full md:w-1/2"
                variant="contained"
                color="error"
                size="large"
              >
                Withdraw Money
              </Button>
            </Link>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default withAdminGuard(AdminDashboard);
