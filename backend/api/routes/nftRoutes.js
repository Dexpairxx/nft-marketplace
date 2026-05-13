const express = require("express");
const multer = require("multer");

const router = express.Router();
const { mintNFT, getNFTsByOwner, getOfferingNFTsByOwner , getListingNFTs, getMarketplaceInfo, getSaleID} = require("../controllers/nftControllers");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Mint NFT
router.post("/mint", upload.single("file"), mintNFT);

// Get NFTs owned by the owner address with listing status
router.get("/address/:address/listing/:listing", getNFTsByOwner);

// Get NFTs is offering by the owner address
router.get("/address/:address/offering", getOfferingNFTsByOwner);

// Get NFTs is listing that is available for user to buy
router.get("/address/:address/buying", getListingNFTs);

// Get contract address and ABI
router.get("/info/marketplace", getMarketplaceInfo);

// Get contract address and ABI
router.get("/info/sale/:token_id", getSaleID);

module.exports = router;