"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useCookies } from "react-cookie";
import { isMobile } from "react-device-detect";
import Image from "next/image";
import { usePathname } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import {
  Box,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Menu,
  MenuItem,
  Button,
  Modal,
  Avatar,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";

import Logo from "../../../public/images/logo.png";
import LoginModal from "./LoginModal";
import { IUser } from "@/interface/user";
import { logoutUser } from "@/services/user";

const GNB_MENU = [
  { key: "tests", text: "테스트" },
  { key: "results", text: "결과보기" },
  { key: "friends", text: "친구" },
];

const NOT_RENDER_URL = ["sign-in", "sign-up", "sign-up/already"];

interface Props {
  user: IUser | undefined;
}

function Header({ user }: Props) {
  const pathname = usePathname();

  if (NOT_RENDER_URL.some((item) => pathname.includes(item))) {
    return null;
  }

  return isMobile ? <MobileHeader user={user} /> : <WebHeader user={user} />;
}

export default Header;

function WebHeader({ user }: Props) {
  const pathname = usePathname();
  const [cookies, _, resetCookie] = useCookies();
  const [isRender, setIsRender] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const isMenuOpen = Boolean(anchorEl);

  const onClickLogout = async () => {
    try {
      await logoutUser({ email: user?.email as string });
      resetCookie("dbti_access_token");
      resetCookie("dbti_refresh_token");
      setAnchorEl(null);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setIsRender(true);
  }, []);

  if (!isRender) return null;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Image src={Logo} width={50} height={50} alt="logo" priority={true} />

          <Box sx={{ flexGrow: 1 }} />
          {/* 
          {GNB_MENU.map((item) => (
            <Box
              key={item.key}
              sx={{
                ...styles.GNB__wrapper,
                color: `/${item.key}` === pathname ? "#ffeb3b" : "white",
              }}
            >
              <Link href={`/${item.key}`}>
                <Typography variant="h6" noWrap component="div">
                  {item.text}
                </Typography>
              </Link>
            </Box>
          ))} */}
          <Box></Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: "flex" }}>
            {!!cookies["dbti_access_token"] ? (
              <Avatar
                src={user?.image_url}
                onClick={(event) => {
                  setAnchorEl(event.currentTarget);
                }}
                sx={{ cursor: "pointer" }}
              />
            ) : (
              <Button
                variant="contained"
                onClick={() => setOpenLoginModal(true)}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Menu
        anchorEl={anchorEl}
        id={"web_menu"}
        keepMounted
        open={isMenuOpen}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => console.log(1244)}>Profile</MenuItem>
        <MenuItem onClick={() => onClickLogout()}>Logout</MenuItem>
      </Menu>

      <Modal open={openLoginModal} onClose={() => setOpenLoginModal(false)}>
        <>
          <LoginModal close={() => setOpenLoginModal(false)} />
        </>
      </Modal>
    </Box>
  );
}

function MobileHeader({ user }: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            MUI
          </Typography>
        </Toolbar>
      </AppBar>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        id={"mobile_menu"}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={isMenuOpen}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem>
          <IconButton
            size="large"
            aria-label="show 4 new mails"
            color="inherit"
          >
            <Badge badgeContent={4} color="error">
              <MailIcon />
            </Badge>
          </IconButton>
          <p>Messages</p>
        </MenuItem>
        <MenuItem>
          <IconButton
            size="large"
            aria-label="show 17 new notifications"
            color="inherit"
          >
            <Badge badgeContent={17} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <p>Notifications</p>
        </MenuItem>
        <MenuItem onClick={() => console.log(123)}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      </Menu>
    </Box>
  );
}

const styles = {
  GNB__wrapper: {
    width: 100,
    textAlign: "center",
    cursor: "pointer",
  },
};
