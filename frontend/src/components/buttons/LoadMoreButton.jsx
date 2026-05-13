// COS30049 Spring 2025 - Assignment 1 - Group 7
// Bui Minh Thuan  - 104486358
// Vu Minh An      - 104993133
// Trinh Nhan Kiet - 104988281

import { Box, Button } from "@mui/material"

function LoadMoreButton(props) {
  // Load more method
  const { onLoadMore } = props

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Button
        variant="contained"
        onClick={onLoadMore}
        sx={{
          backgroundColor: "#ffbd31",
          color: "black",
          fontWeight: "bold",
          "&:hover": {
            backgroundColor: "orange",
          },
          marginBottom: "30px",
        }}
      >
        Load More
      </Button>
    </Box>
  )
}

export default LoadMoreButton