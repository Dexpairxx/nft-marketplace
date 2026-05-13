// COS30049 Spring 2025 - Assignment 2 - Group 7
// Bui Minh Thuan  - 104486358
// Vu Minh An      - 104993133
// Trinh Nhan Kiet - 104988281

const hre = require("hardhat");
const fs = require('fs');

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const maxSupply = 100;
    const maxMintPerAddress = 20;

    // Deploy MarketplaceNFT contract
    const MarketplaceNFT = await hre.ethers.getContractFactory("MarketplaceNFT");
    const marketplace = await MarketplaceNFT.deploy();
    await marketplace.waitForDeployment();
    const marketplaceAddress = await marketplace.getAddress();
    console.log(`MarketplaceNFT deployed at: ${marketplaceAddress}`);

    // Deploy MetaMintNFT contract with the marketplace address
    const MetaMintNFT = await hre.ethers.getContractFactory("MetaMintNFT");
    const mmNFT = await MetaMintNFT.deploy(maxSupply, maxMintPerAddress, marketplaceAddress);
    await mmNFT.waitForDeployment();
    const metaMintAddress = await mmNFT.getAddress();
    console.log(`MetaMintNFT deployed at: ${metaMintAddress}`);

    // Save deployed addresses to a JSON file
    const deployedAddresses = {
        MarketplaceNFT: marketplaceAddress,
        MetaMintNFT: metaMintAddress,
    };
    fs.writeFileSync("contractAddresses.json", JSON.stringify(deployedAddresses, null, 2));
    console.log("Contract addresses saved to contractAddresses.json");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});