import { ethers } from "ethers";
import { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { Box, Typography, Button, CardMedia, TextField, CircularProgress } from "@mui/material";
import { getContract } from "../../utils/getContract";
import axios from "axios";

function SellingModal({ nft, onClose }) {
  const { user } = useContext(UserContext);
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  if (!nft) return null;

  const handleSellClick = async () => {
    console.log("clicked");

    // Basic validation for the price input
    if (price.trim() === "" || isNaN(price) || Number(price) <= 0) {
      console.log("Invalid price");
      setPrice("Invalid price");
      return;
    }

    try {
      setLoading(true);
      console.log("Attempting to sell NFT:", nft);
      console.log("Base price in ETH:", price);

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/nft/info/marketplace`);
      console.log("Response from server:", res.data);
  
      const { mintAddress, marketplaceAddress, mintContractABI, marketplaceContractABI } = res.data;

      const contract = await getContract(marketplaceAddress, marketplaceContractABI);
      console.log("Contract obtained:", contract);

      const costInWei = ethers.parseEther(price); // Convert ETH to Wei
      console.log("Base price in Wei:", costInWei.toString());

      const transaction = await contract.createSale(
        mintAddress, // NFT contract address
        nft.token_id,              // Token ID
        costInWei            // Base price in Wei
      );

      console.log("Transaction sent, waiting for confirmation...");
      await transaction.wait();
      console.log("Sale created successfully:", transaction);

      setTimeout(function() {
        window.location.reload()
      }, 2000)

      onClose();
    } catch (error) {
      console.error("Error creating sale:", error);
      alert("Failed to create sale. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Clear error message when input gains focus
  const handleFocus = () => {
    if (price === "Invalid price") {
      setPrice("");
    }
  };

  return (
    <>
      <CardMedia
        component="img"
        image={nft.metadata.image}
        alt={nft.metadata.name}
        sx={{ width: { xs: "100%", md: "50%" }, borderRadius: 2 }}
      />
      <Box sx={{ flex: 1, p: 2 }}>
        <Typography variant="h3" fontWeight="bold">{nft.name}</Typography>
        <Typography color="textSecondary" sx={{ fontSize: "1.2rem", marginBottom: "8px" }}>
          {nft.metadata.description}
        </Typography>
        <Typography color="textSecondary" sx={{ fontSize: "1.2rem", marginBottom: "10px" }}>
          Mint Date: {nft.metadata.mintDate}
        </Typography>
        <Typography color="textSecondary" sx={{ fontSize: "1.2rem", marginBottom: "10px" }}>
          Current Owner: {`${user.account.slice(0, 8)}...${user.account.slice(-8)}`}
        </Typography>

        <TextField
          label="Price (ETH)"
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          onFocus={handleFocus}
        />

        <Button
          type="button"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3, fontSize: "1.1rem", fontWeight: "bold", marginBottom: 2 }}
          onClick={handleSellClick}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Sell"}
        </Button>
      </Box>
    </>
  );
}

export default SellingModal;