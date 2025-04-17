import { ReactNode, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  IconButton,
  Drawer,
  ListItem,
  List,
} from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import NoticeFooter from "@/components/notice-footer";
import Image from "next/image";
import MenuIcon from "@mui/icons-material/Menu";
import ListItemText from "@mui/material/ListItemText";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const router = useRouter();
  const [openDrawer, setOpenDrawer] = useState(false);

  // Helper function to get the title based on the current route
  const getPageTitle = () => {
    return "MOCKED G-SHOP";
  };

  const isAdminPath = () => router.pathname.startsWith("/admin");

  const getMenuItems = () => {
    if (isAdminPath()) {
      return [
        { title: "Manage cards", link: "/admin/card-type" },
        { title: "Redeem voucher", link: "/admin/redeem-voucher" },
        { title: "Withdraw", link: "/admin/withdraw" },
      ];
    }
    if (router.pathname.startsWith("/customer")) {
      return [
        { title: "My cards", link: "/customer/my-cards" },
        { title: "Buy from shop", link: "/customer/buy-from-shop" },
        { title: "Buy from market", link: "/customer/buy-from-peer" },
      ];
    }
    return [];
  };

  return (
    <Box className="flex flex-col min-h-screen">
      <AppBar
        position="static"
        sx={{
          background: !isAdminPath()
            ? "linear-gradient(to right,#87ceeb, #00008b )"
            : "linear-gradient(to right, #4ade80, #16a34a)",
        }}
      >
        <Toolbar className="flex">
          <Typography variant="h6" color="black" style={{ flexGrow: 1 }}>
            <Link href="/" className="flex items-center space-x-2">
              {/* <CardGiftcardIcon className="flex items-center mx-4 text-black" /> */}
              <Image
                className="mx-3"
                src="/images/cart.webp"
                alt="logo"
                width={48}
                height={48}
              />
              {getPageTitle()}{" "}
            </Link>
          </Typography>
          <div className="flex items-center space-x-4">
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              {getMenuItems().map((item: any, index) => (
                <Button
                  key={index}
                  sx={{ color: "white" }}
                  className="hover:text-yellow-500"
                  onClick={() => router.push(item.link as string)}
                >
                  {item.title}
                </Button>
              ))}
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={() => setOpenDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </div>
          <Drawer
            anchor="left"
            open={openDrawer}
            onClose={() => setOpenDrawer(false)}
          >
            <List>
              {getMenuItems().map((item: any, index) => (
                <ListItem
                  key={index}
                  onClick={() => router.push(item.link as string)}
                >
                  <ListItemText
                    className="cursor-pointer"
                    primary={item.title}
                  />
                </ListItem>
              ))}
            </List>
          </Drawer>
          <div
            className="flex items-center"
            style={{ transform: "scale(0.65)" }}
          >
            <ConnectButton />
          </div>
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
        {children}
      </Container>
      <NoticeFooter />
    </Box>
  );
};

export default MainLayout;
