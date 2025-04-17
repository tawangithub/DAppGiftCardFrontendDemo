import React from "react";
import { Container, Typography, Box } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
export default function Home() {
  return (
    <div>
      <Container className="mt-5 mb-10">
        <Box textAlign="center" mt={10}>
          <Typography variant="h3" gutterBottom>
            Welcome to Our Mocked Gift Card Shop
          </Typography>
          <Typography variant="h5" gutterBottom>
            Are you a customer or a shop admin?
          </Typography>
          <Box mt={5}>
            <div className="flex flex-col md:flex-row justify-center items-center gap-10">
              <Link href="/customer/my-cards">
                <div className="flex max-w-[300px] mx-auto justify-center items-center border-2 border-gray-300 hover:bg-gray-200 transition duration-300">
                  <Image
                    src="/images/customer.jpg"
                    alt="Customer"
                    width={300}
                    height={200}
                    className="hover:opacity-85 transition duration-300"
                  />
                </div>
              </Link>
              <Link href="/admin/dashboard">
                <div className="flex max-w-[300px] mx-auto justify-center items-center border-2 border-gray-300 hover:bg-gray-200 transition duration-300">
                  <Image
                    src="/images/admin.jpg"
                    alt="shop admin"
                    width={300}
                    height={200}
                    className="hover:opacity-85 transition duration-300"
                  />
                </div>
              </Link>
            </div>
          </Box>
        </Box>
      </Container>
    </div>
  );
}
