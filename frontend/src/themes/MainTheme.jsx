// COS30049 Spring 2025 - Assignment 1 - Group 7
// Bui Minh Thuan  - 104486358
// Vu Minh An      - 104993133
// Trinh Nhan Kiet - 104988281

import { createTheme } from "@mui/material/styles";
import { GlobalStyles } from "@mui/system";

const MainTheme = createTheme({
  palette: {
    primary: {
      main: "#ffbd31",
    }
  },
});

export const GlobalStyle = () => (
  <GlobalStyles
    styles={{
      main: {
        minHeight: "100vh",
      },
    }}
  />
);

export default MainTheme;
