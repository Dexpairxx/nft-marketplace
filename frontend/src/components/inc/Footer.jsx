// COS30049 Spring 2025 - Assignment 1 - Group 7
// Bui Minh Thuan  - 104486358
// Vu Minh An      - 104993133
// Trinh Nhan Kiet - 104988281

import { GitHub } from "@mui/icons-material";
import { Box, Typography, IconButton } from "@mui/material";

// Footer for website, reuse in all pages
function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px",
        backgroundColor: "black",
        color: "white",
        position: "relative",
        mt: "auto",
      }}
    >
      <Typography
        variant="h6"
        noWrap
        component="a"
        href='/'
        sx={{
          display: 'flex',
          fontFamily: 'monospace', fontWeight: 600, letterSpacing: '.1rem', textDecoration: 'none',
          color: 'white',
        }}
      >
        METAMINT
      </Typography>

      <Typography
        variant="body2"
        sx={{
          fontSize: { xs: "0.6rem", sm: "0.875rem" }
        }}
      >
        © 2025 METAMINT.com. All rights reserved.
      </Typography>

      <IconButton
        href="https://github.com/COS30049-SUVHN/group-project-spr-2025-g7"
        target="_blank"
        sx={{ color: "white" }}
      >
        <GitHub />
      </IconButton>
    </Box>
  );
}

export default Footer