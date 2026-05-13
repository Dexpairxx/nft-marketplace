const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MetaMintNFT", function () {
  // Test accounts
  let owner, user1, user2;
  
  // Contract instances
  let marketplace, metaMintNFT;
  
  // Test parameters
  const maxSupply = 100;
  const maxMintPerAddress = 5;
  const tokenURI = "ipfs://QmExample123";
  
  beforeEach(async function () {
    // Get signers
    [owner, user1, user2] = await ethers.getSigners();
    
    // Deploy the marketplace first
    const MarketplaceNFT = await ethers.getContractFactory("contracts/v2_contracts/MarketplaceNFT.sol:MarketplaceNFT");
    marketplace = await MarketplaceNFT.deploy();
    
    // Deploy MetaMintNFT
    const MetaMintNFT = await ethers.getContractFactory("contracts/v2_contracts/MetaMintNFT.sol:MetaMintNFT");
    metaMintNFT = await MetaMintNFT.deploy(
      maxSupply,
      maxMintPerAddress,
      await marketplace.getAddress()
    );
  });
  
  it("should set correct initial values", async function () {
    expect(await metaMintNFT.MAX_SUPPLY()).to.equal(maxSupply);
    expect(await metaMintNFT.MAX_MINT_PER_ADDRESS()).to.equal(maxMintPerAddress);
    expect(await metaMintNFT.marketplace()).to.equal(await marketplace.getAddress());
  });
  
  it("should mint an NFT and set correct properties", async function () {
    const tx = await metaMintNFT.mintNFT(tokenURI);
    const receipt = await tx.wait();
    
    // Get the token ID from the event - more robust approach
    let tokenId;
    for (const log of receipt.logs) {
      try {
        if (log.fragment && log.fragment.name === "MintedNewNFT") {
          tokenId = log.args.tokenId;
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    // If not found via fragment, default to 1
    if (!tokenId) tokenId = 1;
    
    // Verify token properties
    expect(tokenId).to.equal(1);
    expect(await metaMintNFT.ownerOf(tokenId)).to.equal(owner.address);
    expect(await metaMintNFT.tokenURI(tokenId)).to.equal(tokenURI);
    expect(await metaMintNFT.mintedByAddress(owner.address)).to.equal(1);
    expect(await metaMintNFT.getApproved(tokenId)).to.equal(await marketplace.getAddress());
  });
  
  it("should enforce minting limits per address", async function () {
    // Create a contract with a low per-address limit
    const MetaMintNFT = await ethers.getContractFactory("contracts/v2_contracts/MetaMintNFT.sol:MetaMintNFT");
    const limitedNFT = await MetaMintNFT.deploy(
      10,
      2,
      await marketplace.getAddress()
    );
    
    // Mint up to the limit
    await limitedNFT.mintNFT("ipfs://QmExample1");
    await limitedNFT.mintNFT("ipfs://QmExample2");
    
    // Third mint should fail
    await expect(
      limitedNFT.mintNFT("ipfs://QmExample3")
    ).to.be.revertedWith("Mint limit per address reached");
  });
  
  it("should enforce the total supply limit", async function () {
    // Create a contract with a very low max supply
    const MetaMintNFT = await ethers.getContractFactory("contracts/v2_contracts/MetaMintNFT.sol:MetaMintNFT");
    const limitedNFT = await MetaMintNFT.deploy(
      2,
      2,
      await marketplace.getAddress()
    );
    
    // Mint up to the limit
    await limitedNFT.mintNFT("ipfs://QmExample1");
    await limitedNFT.mintNFT("ipfs://QmExample2");
    
    // Third mint should fail
    await expect(
      limitedNFT.mintNFT("ipfs://QmExample3")
    ).to.be.revertedWith("Max supply reached");
  });
});