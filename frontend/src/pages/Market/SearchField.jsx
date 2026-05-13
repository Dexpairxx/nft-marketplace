// COS30049 Spring 2025 - Assignment 1 - Group 7
// Bui Minh Thuan  - 104486358
// Vu Minh An      - 104993133
// Trinh Nhan Kiet - 104988281

import { TextField, InputAdornment, Container, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchField({ onSearch }) {
  return (
    <Container sx={{ textAlign: "center", mt: 5, }}>
      <Typography variant="h3" sx={{ color: "black", fontWeight: "bold", fontSize: { xs: "1.5rem", sm: "2rem", md: "3rem" } }}>
        Find your next collectible
      </Typography>
      <Typography variant="h3" sx={{ color: "orange", fontWeight: "bold", fontSize: { xs: "1.5rem", sm: "2rem", md: "3rem" } }}>
        wherever it lives
      </Typography>

      <TextField
        fullWidth
        placeholder="Search profiles and NFTs by name..."
        size="small"
        variant="outlined"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            onSearch(event.target.value);
          }
        }}
        autoFocus
        sx={{
          mt: 3,
          background: "#f7f7f7",
          borderRadius: "50px",
          width: "95%",
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'transparent' },
            '&:hover fieldset': { borderColor: 'transparent' },
            '&.Mui-focused fieldset': { borderColor: 'transparent' },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "gray" }} />
            </InputAdornment>
          ),
        }}
      />
    </Container>
  );
}
