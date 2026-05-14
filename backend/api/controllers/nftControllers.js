const {uploadFile, uploadMetaData} = require("../services/pinataService")
const conn = require("../../database/database");
const fs = require("fs");
const path = require("path");

const BLOCKCHAIN_DIR = path.join(__dirname, "../../../blockchain");

// Controller function to return contract address and ABI
const getMarketplaceInfo = async (req, res) => {
    const contractAddress = JSON.parse(fs.readFileSync(path.join(BLOCKCHAIN_DIR, "contractAddresses.json")));

    const mintAddress = contractAddress.MetaMintNFT;
    const marketplaceAddress = contractAddress.MarketplaceNFT;

    const mintContractABI = JSON.parse(fs.readFileSync(path.join(BLOCKCHAIN_DIR, "artifacts/contracts/MetaMintNFT.sol/MetaMintNFT.json"))).abi
    const marketplaceContractABI = JSON.parse(fs.readFileSync(path.join(BLOCKCHAIN_DIR, "artifacts/contracts/MarketplaceNFT.sol/MarketplaceNFT.json"))).abi
    
    res.json({ success: true, mintAddress, marketplaceAddress, mintContractABI, marketplaceContractABI });
}

// Controller function to mint NFT
const mintNFT = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Upload file to Pinata
        const uploadFileResult = await uploadFile(req.file);

        // Construct metadata from upload file result
        const metaData = {
            name: req.body.name,
            descriptions: req.body.description,
            tag: JSON.parse(req.body.tags),
            mintDate: req.body.mintDate,
            image: uploadFileResult.PinataUrl,
        }

        console.log(metaData)

        const uploadMetaDataResult = await uploadMetaData(metaData);
       
        console.log(uploadMetaDataResult)
        const contractAddress = JSON.parse(fs.readFileSync(path.join(BLOCKCHAIN_DIR, "contractAddresses.json"))).MetaMintNFT;
        const contractABI = JSON.parse(fs.readFileSync(path.join(BLOCKCHAIN_DIR, "artifacts/contracts/MetaMintNFT.sol/MetaMintNFT.json"))).abi
        
        res.json({ success: true, uploadMetaDataResult, contractAddress, contractABI });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller to get NFTs owned by the owner address with listing status
const getNFTsByOwner = async (req, res) => {
    const ownerAddress = req.params.address;
    const listing = req.params.listing; 

    try {
        if (!ownerAddress) {
            console.error("Owner address is missing");
            return res.status(400).json({ error: "Owner address is required" });
        }

        // Check if listing 0 or 1
        if (listing !== "0" && listing !== "1") {
            console.error("Invalid listing parameter");
            return res.status(400).json({ error: "Listing parameter must be '0' or '1'" });
        }

        console.log("Received owner address:", ownerAddress, "with listing:", listing);

        // SQL query to get NFTs with the given listing status for the owner address
        const query = `
            SELECT nfts.* 
            FROM nfts
            JOIN users ON nfts.owner_address = users.address
            WHERE users.address = ?
              AND nfts.on_listing = ?;
        `;

        console.log("Executing query with listing status:", listing);

        // Execute the query using promise
        const [results] = await conn.execute(query, [ownerAddress, parseInt(listing)]);

        console.log("Query executed successfully, results:", results);

        // Return the fetched NFTs
        console.log("Returning NFTs:", results);
        return res.status(200).json({ nfts: results });
    } catch (error) {
        console.error("Error in getNFTByOwner:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Controller to get NFTs that the current user has made active offers on
const getOfferingNFTsByOwner = async (req, res) => {
    const ownerAddress = req.params.address;

    try {
        if (!ownerAddress) {
            console.error("Owner address is missing");
            return res.status(400).json({ error: "Owner address is required" });
        }

        // Query to get NFTs with active offers made by the current user from active listings
        const query = `
            SELECT nfts.*, offers.offer_price, offers.status AS offer_status, listings.base_price, listings.status AS listing_status
            FROM offers
            JOIN listings ON offers.listing_id = listings.id
            JOIN nfts ON listings.nft_id = nfts.id
            JOIN users ON offers.offer_from_id = users.id
            WHERE users.address = ?
              AND offers.status = 'active'
              AND listings.status = 'active';
        `;

        // Execute the query
        const [results] = await conn.execute(query, [ownerAddress]);

        // Return the fetched offered NFTs
        console.log("Returning active offered NFTs:", results);
        return res.status(200).json({ nfts: results });
    } catch (error) {
        console.error("Error in getOfferedNFTs:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Controller to get listed NFTs
const getListingNFTs = async (req, res) => {
    const userAddress = req.params.address.toLowerCase();

    try {
        const query = `
            SELECT nfts.*, listings.price, listings.from_account
            FROM nfts
            JOIN listings ON nfts.token_id = listings.token_id AND listings.status = 'active'
            WHERE nfts.owner_address != ?
            AND nfts.on_listing = 1;
        `;
        const [nfts] = await conn.execute(query, [userAddress]);
        return res.status(200).json(nfts);
    } catch (error) {
        console.error("Error fetching listed NFTs:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const getSaleID = async (req, res) => {
    try {
      const { token_id } = req.params;
  
      const query = `
        SELECT listings.listing_blockchain_id
        FROM listings
        WHERE token_id = ?
        AND status = 'active';
    `;
  const [nfts] = await conn.execute(query, [token_id]);
  return res.status(200).json(nfts);
    } catch (error) {
      console.error("Error retrieving sale ID:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

module.exports = { mintNFT, getNFTsByOwner, getOfferingNFTsByOwner, getListingNFTs, getMarketplaceInfo, getSaleID };