// COS30049 Spring 2025 - Assignment 1 - Group 7
// Bui Minh Thuan  - 104486358
// Vu Minh An      - 104993133
// Trinh Nhan Kiet - 104988281

import { useState, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { Box, Typography, Button, CardMedia } from "@mui/material";
import { getContract } from "../../utils/getContract";
import axios from "axios";

function ListingModal({ nft, onClose }) {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  if (!nft) return null;
  console.log("ListingModal nft:", nft);

  const onCancelListing = async () => {
    console.log("Clicked Cancel Listing");
    setLoading(true);

    try {
      console.log("Attempting to cancel NFT:", nft);

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/nft/info/marketplace`);
      console.log("Response from server:", res.data);
  
      const { mintAddress, marketplaceAddress, mintContractABI, marketplaceContractABI } = res.data;

      const contract = await getContract(marketplaceAddress, marketplaceContractABI);
      console.log("Contract obtained:", contract);

      const sale = await axios.get(`${import.meta.env.VITE_API_URL}/api/nft/info/sale/${nft.token_id}`);
      console.log("Sale info:", sale.data[0].listing_blockchain_id);
      
      const removal = await contract.removeSale(sale.data[0].listing_blockchain_id);

      await removal.wait();
      console.log("Transaction confirmed:", removal);

      alert("Listing removed successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);

      onClose();
    } catch (error) {
      console.error("Error canceling listing:", error);
      alert("Failed to cancel listing. Please try again.");
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
        p: 3
      }}
    >
      <CardMedia
        component="img"
        image={nft.metadata.image}
        alt={nft.metadata.name}
        sx={{
          width: { xs: "100%", md: "50%" },
          borderRadius: 2,
          objectFit: "cover"
        }}
      />

      <Box sx={{ flex: 1, p: 2 }}>
        <Typography variant="h3" fontWeight="bold">{nft.name}</Typography>
        <Typography
          color="textSecondary"
          sx={{ fontSize: "1.2rem", marginBottom: "8px" }}
        >
          {nft.metadata.descriptions}
        </Typography>

        <Typography
          color="textSecondary"
          sx={{ fontSize: "1.2rem", marginBottom: "8px" }}
        >
          Mint Date: {nft.metadata.mintDate}
        </Typography>

        <Typography
          color="textSecondary"
          sx={{ fontSize: "1.2rem", marginBottom: "10px" }}
        >
          Current Owner: {`${user.account.slice(0, 8)}...${user.account.slice(-8)}`}
        </Typography>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Typography color="textSecondary" sx={{ fontSize: "1.2rem" }}>
            Tags:
          </Typography>
          {nft.metadata.tag?.map((tag, index) => (
            <div
              key={index}
              style={{
                backgroundColor: 'black',
                color: 'white',
                borderRadius: '15px',
                padding: '4px 12px',
                fontSize: '14px',
                fontWeight: '500',
                display: 'inline-block'
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        <Button
          variant="contained"
          color="error"
          fullWidth
          sx={{ mt: 2, fontWeight: "bold", marginBottom: 2 }}
          onClick={onCancelListing}
          disabled={loading}
        >
          {loading ? "Canceling..." : "Cancel Listing"}
        </Button>
      </Box>
    </Box>
  );
}

export default ListingModal;