require("dotenv").config({path: "../.env"});

const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const nftRoutes = require("./routes/nftRoutes");
const tagRoutes = require("./routes/tagRoutes");

// Init express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/user", userRoutes);   // NFT routes
app.use("/api/nft", nftRoutes);     // NFT routes
app.use("/api/tag", tagRoutes);     // Tag routes

// Listen on port
app.listen(process.env.PORT, () => {
  console.log(`App listening on port http://localhost:${process.env.PORT}`);
})