import { useState, useContext, useEffect } from "react";
import { ethers } from "ethers";
import { Box, Modal, Typography, Button, Alert, IconButton, Card, CardContent, Avatar, Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { UserContext } from "../../contexts/UserContext";

function ConnectWalletModal({ open, onClose }) {
  const [accounts, setAccounts] = useState([]);
  const { user, setUser } = useContext(UserContext);
  const [error, setError] = useState("");

  // Function to check MetaMask connection status
  const checkConnection = async () => {
    setError("");

    if (!window.ethereum) {
      setError("MetaMask is not installed. Please install it.");
      setAccounts([]);
      return;
    }

    try {
      const accountsList = await window.ethereum.request({ method: "eth_accounts" });

      if (accountsList.length > 0) {
        setAccounts(accountsList);
        setUser((prevUser) => prevUser?.account ? prevUser : { account: accountsList[0] });
      } else {
        setAccounts([]);
      }
    } catch (err) {
      setError("Failed to check wallet connection.");
      setAccounts([]);
    }
  };

  // Function to connect MetaMask and fetch accounts
  const connectMetaMask = async () => {
    setError("");

    if (!window.ethereum) {
      setError("MetaMask is not installed. Please install it.");
      return;
    }

    try {
      const accountsList = await window.ethereum.request({ method: "eth_requestAccounts" });

      if (accountsList.length > 0) {
        setAccounts(accountsList);
        setUser({ account: accountsList[0] });
        onClose();
      } else {
        setError("No accounts found.");
      }
    } catch (err) {
      setError("Failed to connect to MetaMask.");
      setAccounts([]);
    }
  };

  // Auto update when user changes account in MetaMask
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (newAccounts) => {
        if (newAccounts.length > 0) {
          setAccounts(newAccounts);
          setUser({ account: newAccounts[0] });
        } else {
          setUser(null);
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  }, []);

  // Check connection when modal opens
  useEffect(() => {
    if (open) {
      checkConnection();
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="wallet-popup">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: '100%', sm: '500px', },
          bgcolor: "#fcfbf5",
          paddingBottom: '5px',
          boxShadow: 24,
          p: 4,
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <IconButton onClick={onClose} sx={{ position: "absolute", top: 10, right: 10 }}>
          <CloseIcon />
        </IconButton>

        <Typography variant="h4" id="wallet-popup" gutterBottom
          sx={{
            fontWeight: "bold", color: "#ff7f00"
          }}>
          METAMINT
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {!user?.account && !error && (
          <Card
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#fcfbf5",
              textAlign: "start",
              color: "black",
              p: 2,
              borderRadius: 3,
              cursor: "pointer",
            }}
            onClick={connectMetaMask}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                src="url(./Images/MetaMask_Fox.svg.png)"
                sx={{ width: 40, height: 40, mr: 2 }}
              />
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  MetaMask
                </Typography>
                <Typography variant="body2" color="gray">
                  Connect to your MetaMask Wallet
                </Typography>
              </Box>
            </Box>

            <Chip label="Popular" sx={{ backgroundColor: "#ff7f00", color: "white" }} />
          </Card>
        )}

        {user?.account && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            Connected as: <strong>{user.account}</strong>
          </Typography>
        )}
      </Box>
    </Modal>
  );
}

export default ConnectWalletModal;