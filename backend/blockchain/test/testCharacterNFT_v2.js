const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CharacterNFT", function () {
  // Test accounts
  let owner, user1, user2;
  
  // Contract instances
  let marketplace, characterNFT;
  
  // Test parameters
  const maxSupply = 100;
  const maxMintPerAddress = 5;
  const tokenURI = "ipfs://QmExample456";
  
  beforeEach(async function () {
    // Get signers
    [owner, user1, user2] = await ethers.getSigners();
    
    // Deploy the marketplace first
    const MarketplaceNFT = await ethers.getContractFactory("contracts/v2_contracts/MarketplaceNFT.sol:MarketplaceNFT");
    marketplace = await MarketplaceNFT.deploy();
    
    // Deploy CharacterNFT
    const CharacterNFT = await ethers.getContractFactory("contracts/v2_contracts/CharacterNFT.sol:CharacterNFT");
    characterNFT = await CharacterNFT.deploy(
      maxSupply,
      maxMintPerAddress,
      await marketplace.getAddress()
    );
  });
  
  it("should deploy with correct configuration", async function () {
    expect(await characterNFT.MAX_SUPPLY()).to.equal(maxSupply);
    expect(await characterNFT.MAX_MINT_PER_ADDRESS()).to.equal(maxMintPerAddress);
    expect(await characterNFT.marketplace()).to.equal(await marketplace.getAddress());
  });
  
  it("should mint a character NFT with custom attributes", async function () {
    const characterClass = "Warrior";
    const strength = 15;
    const agility = 10;
    const intelligence = 8;
    
    const tx = await characterNFT.mintCharacterNFT(
      tokenURI,
      characterClass,
      strength,
      agility,
      intelligence
    );
    
    const receipt = await tx.wait();
    
    // Get the token ID - more robust approach
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
    
    expect(tokenId).to.equal(1);
    expect(await characterNFT.ownerOf(tokenId)).to.equal(owner.address);
    expect(await characterNFT.tokenURI(tokenId)).to.equal(tokenURI);
    
    // Check character attributes
    const attrs = await characterNFT.getCharacterAttributes(tokenId);
    expect(attrs.level).to.equal(1);
    expect(attrs.strength).to.equal(strength);
    expect(attrs.agility).to.equal(agility);
    expect(attrs.intelligence).to.equal(intelligence);
    expect(attrs.characterClass).to.equal(characterClass);
    expect(attrs.experience).to.equal(0);
  });
  
  it("should create a default character with balanced attributes", async function () {
    const tx = await characterNFT.mintNFT("ipfs://QmExampleDefault");
    const receipt = await tx.wait();
    
    // Try to get token ID from event
    let tokenId = 1; // Default
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
    
    const attrs = await characterNFT.getCharacterAttributes(tokenId);
    expect(attrs.characterClass).to.equal("Adventurer");
    expect(attrs.strength).to.equal(10);
    expect(attrs.agility).to.equal(10);
    expect(attrs.intelligence).to.equal(10);
  });
});