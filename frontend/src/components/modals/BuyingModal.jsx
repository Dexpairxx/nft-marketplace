import { useState, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { ethers } from "ethers";
import axios from "axios";
import { Box, Typography, Button, CardMedia, CircularProgress } from "@mui/material";
import { getContract } from "../../utils/getContract";

function BuyingModal({ nft, onClose }) {
  if (!nft) return null;

  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const handleSellClick = async () => {
    console.log("Clicked Buy NFT");
    setLoading(true);

    try {
      console.log("Attempting to buy NFT:", nft);

      const res = await axios.get(`${""}/api/nft/info/marketplace`);
      console.log("Response from server:", res.data);

      const { mintAddress, marketplaceAddress, mintContractABI, marketplaceContractABI } = res.data;

      const contract = await getContract(marketplaceAddress, marketplaceContractABI);
      console.log("Contract obtained:", contract);

      const sale = await axios.get(`${""}/api/nft/info/sale/${nft.token_id}`);
      console.log("Sale info:", sale.data[0].listing_blockchain_id);

      const transaction = await contract.purchaseNFT(sale.data[0].listing_blockchain_id, {value: nft.price});

      await transaction.wait();
      console.log("Transaction confirmed:", transaction);

      alert("Buying successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);

      onClose();
    } catch (error) {
      console.error("Error purchasing NFT:", error);
      alert("Failed to buy NFT. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
        p: 3,
      }}
    >
      <CardMedia
        component="img"
        image={nft.metadata.image}
        alt={nft.metadata.name}
        sx={{ width: { xs: "100%", md: "50%" }, borderRadius: 2 }}
      />
      <Box sx={{ flex: 1, p: 2 }}>
        <Typography variant="h3" fontWeight="bold">{nft.name}</Typography>
        <Typography color="textSecondary" sx={{ fontSize: "1.2rem", marginBottom: "8px" }}>
          {nft.metadata.descriptions}
        </Typography>
        <Typography color="textSecondary" sx={{ fontSize: "1.2rem", marginBottom: "10px" }}>
          Mint Date: {nft.metadata.mintDate}
        </Typography>
        <Typography color="textSecondary" sx={{ fontSize: "1.2rem", marginBottom: "10px" }}>
          Current Owner: {`${nft.owner_address.slice(0, 8)}...${nft.owner_address.slice(-8)}`}
        </Typography>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Typography color="textSecondary" sx={{ fontSize: "1.2rem" }}>
            Tags:
          </Typography>
          {nft.metadata.tag && nft.metadata.tag.map((tag, index) => (
            <div
              key={index}
              style={{
                backgroundColor: 'black',
                color: 'white',
                borderRadius: '15px',
                padding: '4px 12px',
                fontSize: '14px',
                fontWeight: '500',
                display: 'inline-block',
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        <Typography variant="body1" fontWeight="bold" sx={{ marginTop: "12px", fontSize: "1.2rem" }}>
          Base Price: {ethers.formatEther(nft.price)} ETH
        </Typography>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3, fontWeight: "bold", marginBottom: 2 }}
          onClick={handleSellClick}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Buy this NFT"}
        </Button>
      </Box>
    </Box>
  );
}

export default BuyingModal;