// COS30049 Spring 2025 - Assignment 1 - Group 7
// Bui Minh Thuan  - 104486358
// Vu Minh An      - 104993133
// Trinh Nhan Kiet - 104988281

import NftCard from "../cards/NftCard.jsx";
import { Box } from "@mui/material";

// Acts as a gallery to display cards
function GridGallery(props) {
  const { nfts, onClick } = props
  
  return (
    <Box sx={{
      display: "grid",
      gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)", md: "repeat(4, 1fr)", lg: "repeat(6, 1fr)" },
      gap: 2, mt: 4, px: "5%",
      "&:last-child": { paddingBottom: "50px" }
    }}>
      {nfts.map((nft, id) => (
        <NftCard key={id} nft={nft} onClick={onClick} />
      ))}
    </Box>
  );
}

export default GridGallery;