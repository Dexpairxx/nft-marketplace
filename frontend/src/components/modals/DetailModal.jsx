// COS30049 Spring 2025 - Assignment 1 - Group 7
// Bui Minh Thuan  - 104486358
// Vu Minh An      - 104993133
// Trinh Nhan Kiet - 104988281

import { Box, Typography, CardMedia } from "@mui/material";

function DetailModal({ nft }) {
  if (!nft) return null;

  return (
    <>
      <CardMedia
        component="img"
        image={nft.fileName}
        alt={nft.name}
        sx={{ width: { xs: "100%", md: "50%" }, borderRadius: 2 }}
      />
      <Box sx={{ flex: 1, p: 2 }}>
        <Typography variant="h3" fontWeight="bold">{nft.name}</Typography>
        <Typography
          color="textSecondary"
          sx={{
            fontSize: "1.2rem",
            marginBottom: "8px",
          }}
        >
          {nft.metadata.description}
        </Typography>

        <Typography
          color="textSecondary"
          sx={{
            fontSize: "1.2rem",
            marginBottom: "10px",
          }}
        >
          Mint Date: {nft.metadata.mintDate}
        </Typography>

        <Typography
          color="textSecondary"
          sx={{
            fontSize: "1.2rem",
            marginBottom: "10px",
          }}
        >
          Current Owner: {`${nft.owner.slice(0, 8)}...${nft.owner.slice(-8)}`}
        </Typography>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Typography
            color="textSecondary"
            sx={{
              fontSize: "1.2rem",
            }}
          >
            Tags:
          </Typography>
          {nft.tags && nft.tags.map((tag, index) => (
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
      </Box>
    </>
  );
}

export default DetailModal;