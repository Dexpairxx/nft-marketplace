// COS30049 Spring 2025 - Assignment 1 - Group 7
// Bui Minh Thuan  - 104486358
// Vu Minh An      - 104993133
// Trinh Nhan Kiet - 104988281

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { GlobalProvider } from "./contexts/GlobalContext.jsx";

import CssBaseline from "@mui/material/CssBaseline";
import MainTheme, { GlobalStyle } from "./themes/MainTheme.jsx";

import Layout from "./layouts/Layout.jsx"
import Home from "./pages/Home/Home.jsx"
import Market from "./pages/Market/Market.jsx"
import Profile from "./pages/Profile/Profile.jsx"

function App() {

  return (
    <ThemeProvider theme={MainTheme}>
      <CssBaseline />
      <GlobalStyle />
      <GlobalProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/market" element={<Market />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Home />} />
            </Route>
          </Routes>
        </Router>
      </GlobalProvider>
    </ThemeProvider>
  )
}

export default App