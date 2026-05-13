// COS30049 Spring 2025 - Assignment 1 - Group 7
// Bui Minh Thuan  - 104486358
// Vu Minh An      - 104993133
// Trinh Nhan Kiet - 104988281

import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";

function NftCard(props) {
  // Nft and onClick function
  const { nft, onClick } = props;

  console.log("???????????")
  console.log(nft);
  console.log("??????")

  return (
    <Card
      onClick={() => onClick(nft)}
      sx={{
        borderRadius: 3,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        height: { xs: "200px", sm: "280px", md: "300px", lg: "320px" },
        overflow: "hidden",
        position: "relative",
        "&:hover": {
          '& .gradient-overlay': {
            opacity: 1,
          }
        },
      }}>

      {/* Image container with hover effect */}
      <Box sx={{
        flex: 1,
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.3s ease",
        "&:hover": {
          transform: "scale(1.2)",
        },
      }}>

        {/* NFT Image */}
        <CardMedia
          component="img"
          image={nft['metadata']['image']}
          alt={nft['metadata']['name']}
          sx={{
            height: "100%",
            width: "100%",
            objectFit: "cover",
          }}
        />

        {/* Gradient overlay */}
        <Box className="gradient-overlay"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.5) 100%)",
            opacity: 0,
            transition: "opacity 0.3s ease",
            zIndex: 1,
          }}
        />
      </Box>

      {/* NFT name */}
      <CardContent
        sx={{
          padding: { xs: "10px", sm: "12px", md: "14px" },
          backgroundColor: "white",
          zIndex: 2,
          textAlign: "left",
          flexShrink: 0,
          maxHeight: { xs: "60px", sm: "70px", md: "80px", },
        }}>
        <Typography variant="body1" fontWeight="bold" noWrap
          sx={{
            fontSize: { xs: "16px", sm: "20px" },
          }}
        >
          {nft['metadata']['name']}
        </Typography>
        <Typography variant="body1" noWrap
          sx={{
            fontSize: "0.85em",
            color: "#6a6a6a"
          }}
        >
          {nft['metadata']['descriptions']}
        </Typography>

      </CardContent>
    </Card>
  )
}

export default NftCard;