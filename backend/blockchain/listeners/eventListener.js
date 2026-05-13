// COS30049 Spring 2025 - Assignment 2 - Group 7
// Bui Minh Thuan  - 104486358
// Vu Minh An      - 104993133
// Trinh Nhan Kiet - 104988281

require("dotenv").config({ path: "../.env" });
const { ethers } = require("ethers");
const fs = require("fs");
const conn = require("../../database/database");
const axios = require("axios");

// Load contract ABI & address
const contractAddresses = JSON.parse(
    fs.readFileSync("../contractAddresses.json")
);
const metaMintNFTAddress = contractAddresses.MetaMintNFT;
const marketplaceAddress = contractAddresses.MarketplaceNFT;

const metaMintABI = JSON.parse(
    fs.readFileSync("../artifacts/contracts/MetaMintNFT.sol/MetaMintNFT.json")
).abi;

const marketplaceABI = JSON.parse(
    fs.readFileSync("../artifacts/contracts/MarketplaceNFT.sol/MarketplaceNFT.json")
).abi;

// Connect to blockchain
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const contract = new ethers.Contract(metaMintNFTAddress, metaMintABI, provider);
const marketplaceContract = new ethers.Contract(marketplaceAddress, marketplaceABI, provider);

async function insertUser(address) {
    try {
        const [rows] = await conn.query(
            "SELECT * FROM users WHERE address = ?",
            [address]
        );
        if (rows.length === 0) {
            await conn.query(
                "INSERT INTO users (address) VALUES (?)",
                [address]
            );
            console.log(`[DB] User ${address} added.`);
        }
    } catch (err) {
        console.error("[DB] Error inserting user:", err);
    }
}

async function approveListing(saleId, buyer, vendor, assetAddress, itemId, cost) {
    try {

        // Get the token_id from the listing that corresponds to the given sale_id
        const [rows] = await conn.query(
            "SELECT token_id FROM listings WHERE listing_blockchain_id = ?",
            [saleId]
        );

        if (rows.length === 0) {
            console.log(`[DB] No listing found with sale_id: ${sale_id}`);
            return;
        }

        const token_id = rows[0].token_id;

        // Update the status of the NFT listing
        await conn.query(
            "UPDATE listings SET status='cancelled' WHERE listing_blockchain_id = ? AND status='active'",
            [saleId]
        );

        // Mark the NFT as not on sale
        await conn.query(
            "UPDATE nfts SET owner_address = ?, on_listing = 0 WHERE token_id = ?",
            [buyer, itemId]
        );
    
        console.log(`[DB] NFT ${itemId} successfully transferred from ${vendor} to ${buyer}.`);
    } catch (error) {
        console.error(`[ERROR] Failed to approve buying for saleId ${saleId}:`, error);
    }
}

async function cancelListing(sale_id) {
    try {

        // Get the token_id from the listing that corresponds to the given sale_id
        const [rows] = await conn.query(
            "SELECT token_id FROM listings WHERE listing_blockchain_id = ?",
            [sale_id]
        );

        if (rows.length === 0) {
            console.log(`[DB] No listing found with sale_id: ${sale_id}`);
            return;
        }

        const token_id = rows[0].token_id;

        // Update the status of the NFT listing
        await conn.query(
            "UPDATE listings SET status='cancelled' WHERE listing_blockchain_id = ? AND status='active'",
            [sale_id]
        );

        // Mark the NFT as not on sale
        await conn.query(
            "UPDATE nfts SET on_listing='0' WHERE token_id = ?",
            [token_id]
        );

        console.log(`[DB] Listing for token ${token_id} canceled  from the listings table.`);
    } catch (error) {
        console.error(`[ERROR] Failed to cancel listing for sale_id ${sale_id}:`, error);
    }
}

async function insertListing(token_id, from_account, price, listing_blockchain_id) {
    try {
        const [rows] = await conn.query(
            "SELECT * FROM listings WHERE token_id = ? AND status = 'active'",
            [token_id]
        );

        await conn.query(
            "INSERT INTO listings (token_id, from_account, price, listing_blockchain_id, status) VALUES (?, ?, ?, ?, 'active')",
            [token_id, from_account, price, listing_blockchain_id]
        );
        console.log(`[DB] Listing for token ${token_id} added.`);

        await conn.query(
            "UPDATE nfts SET on_listing='1' WHERE token_id = ?",
            [token_id]
        );
        console.log(`[DB] Listing for token ${token_id} updated on the asset table.`);

    } catch (err) {
        console.error("[DB] Error inserting user:", err);
    }
}

async function insertNFT(tokenId, owner, metadataUrl) {
    try {
        await conn.query(
            "INSERT INTO nfts (token_id, owner_address, metadata_url) VALUES (?, ?, ?)",
            [tokenId, owner, metadataUrl]
        );
        console.log(`[DB] NFT ${tokenId} inserted with owner ${owner}.`);
    } catch (err) {
        console.error("[DB] Error inserting NFT:", err);
    }
}

async function insertTransaction(type, from, to, value, txHash) {
    try {
        await conn.query(
            "INSERT INTO transactions (type, from_account, to_account, value, transaction_hash) VALUES (?, ?, ?, ?, ?)",
            [type, from, to, value, txHash]
        );
        console.log(`[DB] Transaction ${txHash} of type ${type} inserted.`);
    } catch (err) {
        console.error("[DB] Error inserting transaction:", err);
    }
}

async function listenForEvents() {
    try {
        marketplaceContract.on("SaleCreated", async (saleId, vendor, assetAddress, itemId, cost, event) => {
            console.log(
                `New NFT sale created. Sale ID: ${saleId}, Token ID: ${itemId}, Owner: ${vendor}, Cost: ${cost}, Transaction hash: ${event.log.transactionHash}`
            );

            // Check and insert owner address if not present
            await insertUser(vendor);

            // Check and insert contract address if not present
            await insertUser(marketplaceAddress);

            // Check if we already have listing for that tokenId/itemId
            // If not, create a new record in the database
            await insertListing(itemId, vendor, cost, saleId)

            // Insert sale transaction
            await insertTransaction(
                "listing",
                vendor, // contract address
                marketplaceAddress, // to (new owner)
                0,
                event.log.transactionHash // transaction hash
            );
        })

        marketplaceContract.on("SaleCompleted", async (saleId, buyer, vendor, assetAddress, itemId, cost, event) => {
            console.log(
                `NFT sale completed. Sale ID: ${saleId}, Token ID: ${itemId}, Buyer: ${buyer}, Owner: ${vendor}, Cost: ${cost}, Transaction hash: ${event.log.transactionHash}`
            );

            // Check and insert buyer address if not present
            await insertUser(buyer);

            // Check and insert owner address if not present
            await insertUser(vendor);

            await approveListing(saleId, buyer, vendor, assetAddress, itemId, cost);

            // Insert sale transaction
            await insertTransaction(
                "sell",
                vendor, // contract address
                buyer, // to (new owner)
                cost,
                event.log.transactionHash // transaction hash
            );

            await insertTransaction(
                "transfer",
                vendor, // contract address
                buyer, // to (new owner)
                0,
                event.log.transactionHash // transaction hash
            );
        })

        marketplaceContract.on("SaleRemoved", async (saleId, vendor, event) => {
            console.log(
                `NFT sale removed. Sale ID: ${saleId}, Owner: ${vendor}, Transaction hash: ${event.log.transactionHash}`
            );

            // Check and insert owner address if not present
            await insertUser(vendor);

            // Check and insert contract address if not present
            await insertUser(marketplaceAddress);

            await cancelListing(saleId)

            // Insert sale transaction
            await insertTransaction(
                "removeListing",
                vendor, // contract address
                marketplaceAddress, // to (new owner)
                0,
                event.log.transactionHash // transaction hash
            );
        })

        contract.on("mintedNewNFT", async (tokenId, owner, metadataUrl, event) => {
            console.log(
                `New NFT minted. Token ID: ${tokenId}, Owner: ${owner}, Metadata: ${metadataUrl}, Transaction hash: ${event.log.transactionHash}`
            );

            // Check and insert contract address if not present
            await insertUser(metaMintNFTAddress);

            // Check and insert owner address if not present
            await insertUser(owner);

            // Insert minted NFT into the database
            await insertNFT(tokenId, owner, metadataUrl);

            // Insert mint transaction
            await insertTransaction(
                "mint",
                metaMintNFTAddress, // contract address
                owner, // to (new owner)
                0, // value (no value transferred during mint)
                event.log.transactionHash // transaction hash
            );
        });

        console.log("[On-chain event] Listening for mintedNewNFT events...");
    } catch (err) {
        console.error("[On-chain event] Listener error:", err);
    }

}

listenForEvents().catch((err) =>
    console.error("[On-chain event] Listener error:", err)
);