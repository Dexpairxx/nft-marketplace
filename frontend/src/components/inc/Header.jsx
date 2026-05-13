import { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { AccountContext } from "../../contexts/AccountContext";
import {
  Box, AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ConnectWalletModal from "../modals/ConnectWalletModal";  // Import WalletPopup

function Header() {
  const { user, setUser } = useContext(UserContext);
  const { accounts } = useContext(AccountContext);
  const [anchorElMenu, setAnchorElMenu] = useState(null);
  const [showWalletPopup, setShowWalletPopup] = useState(false);  // Manage popup state

  const handleOpenMenu = (event) => setAnchorElMenu(event.currentTarget);
  const handleCloseMenu = () => setAnchorElMenu(null);

  // Toggle WalletPopup
  const handleOpenPopup = () => setShowWalletPopup(true);
  const handleClosePopup = () => setShowWalletPopup(false);

  const pages = [
    { name: "NFTs", link: "/market" },
    { name: "Profiles", link: "/profile" },
  ];

  return (
    <header>
      <AppBar
        sx={{
          position: "fixed",
          backgroundColor: "white",
          color: "black",
          width: "95%",
          borderRadius: "50px",
          marginX: "2.5%",
          marginY: "20px",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/home"
            sx={{
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".1rem",
              textDecoration: "none",
              color: "#ff7f00",
            }}
          >
            METAMINT
          </Typography>

          {/* Large Screen Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page, id) => (
              <Button
                key={id}
                component={Link}
                to={page.link}
                sx={{
                  m: "5px",
                  color: "black",
                  "&:hover": { backgroundColor: "#ffbd31", color: "black" },
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {/* Connect Wallet Button */}
          <Button
            sx={{
              display: { xs: "none", md: "block" },
              my: 2,
              backgroundColor: "#fbd34c",
              color: "black",
              borderRadius: "15px",
              paddingX: "12px",
              "&:hover": { backgroundColor: "orange" },
            }}
            onClick={handleOpenPopup}  // Open popup when clicked
          >
            {user && user.account
              ? `${user.account.slice(0, 6)}...${user.account.slice(-4)}`
              : "Connect Wallet"}
          </Button>

          {/* Small Screen Menu */}
          <Box sx={{ display: { xs: "block", md: "none" } }}>
            <IconButton size="large" onClick={handleOpenMenu}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElMenu}
              open={Boolean(anchorElMenu)}
              onClose={handleCloseMenu}
              sx={{ mt: "10px", mr: "2.5%" }}
            >
              {pages.map((page, id) => (
                <MenuItem key={id} onClick={handleCloseMenu}>
                  <Typography
                    component={Link}
                    to={page.link}
                    sx={{ textDecoration: "none", color: "black" }}
                  >
                    {page.name}
                  </Typography>
                </MenuItem>
              ))}

              {/* Connect Wallet in Small Screen */}
              <MenuItem sx={{ flexDirection: "column", alignItems: "center" }}>
                <Button
                  sx={{
                    backgroundColor: "#fbd34c",
                    color: "black",
                    borderRadius: "15px",
                    paddingX: "12px",
                    "&:hover": { backgroundColor: "orange" },
                  }}
                  onClick={handleOpenPopup}
                >
                  {user && user.account
                    ? `${user.account.slice(0, 6)}...${user.account.slice(-4)}`
                    : "Connect Wallet"}
                </Button>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Render WalletPopup Component */}
      <ConnectWalletModal open={showWalletPopup} onClose={handleClosePopup} />
    </header>
  );
}

export default Header;
