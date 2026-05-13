const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MarketplaceNFT", function () {
  // Test accounts
  let owner, buyer, user2;
  
  // Contract instances
  let marketplace, metaMintNFT, characterNFT;
  
  // Test parameters
  const maxSupply = 100;
  const maxMintPerAddress = 5;
  let salePrice;
  let metaMintTokenId, characterTokenId;
  
  before(async function () {
    // Initialize sale price using ethers from hardhat
    salePrice = ethers.parseEther("1.0");
  });
  
  beforeEach(async function () {
    // Get signers
    [owner, buyer, user2] = await ethers.getSigners();
    
    // Deploy the marketplace first
    const MarketplaceNFT = await ethers.getContractFactory("contracts/v2_contracts/MarketplaceNFT.sol:MarketplaceNFT");
    marketplace = await MarketplaceNFT.deploy();
    await marketplace.waitForDeployment();
    
    // Deploy MetaMintNFT
    const MetaMintNFT = await ethers.getContractFactory("contracts/v2_contracts/MetaMintNFT.sol:MetaMintNFT");
    metaMintNFT = await MetaMintNFT.deploy(
      maxSupply,
      maxMintPerAddress,
      await marketplace.getAddress()
    );
    await metaMintNFT.waitForDeployment();
    
    // Deploy CharacterNFT
    const CharacterNFT = await ethers.getContractFactory("contracts/v2_contracts/CharacterNFT.sol:CharacterNFT");
    characterNFT = await CharacterNFT.deploy(
      maxSupply,
      maxMintPerAddress,
      await marketplace.getAddress()
    );
    await characterNFT.waitForDeployment();
    
    // Mint NFTs for testing
    const metaMintTx = await metaMintNFT.mintNFT("ipfs://QmMetaMintExample");
    const metaMintReceipt = await metaMintTx.wait();
    // Find the event using a more generic approach that works with different ethers versions
    const metaMintEvent = metaMintReceipt.logs.find(log => {
      try {
        return log.fragment && log.fragment.name === "MintedNewNFT";
      } catch (e) {
        return false;
      }
    });
    metaMintTokenId = metaMintEvent ? metaMintEvent.args.tokenId : 1; // Default to 1 if event not found
    
    const characterTx = await characterNFT.mintCharacterNFT(
      "ipfs://QmCharacterExample",
      "Warrior",
      15,
      10,
      8
    );
    const characterReceipt = await characterTx.wait();
    const characterEvent = characterReceipt.logs.find(log => {
      try {
        return log.fragment && log.fragment.name === "MintedNewNFT";
      } catch (e) {
        return false;
      }
    });
    characterTokenId = characterEvent ? characterEvent.args.tokenId : 1; // Default to 1 if event not found
  });
  
  it("should initially have sale ID 1", async function () {
    expect(await marketplace.currentSaleId()).to.equal(1);
  });
  
  it("should create a sale for a MetaMint NFT", async function () {
    // Create a sale
    const metaMintAddress = await metaMintNFT.getAddress();
    await marketplace.createSale(metaMintAddress, metaMintTokenId, salePrice);
    
    // Check sale details
    const sale = await marketplace.sales(1);
    
    expect(sale.vendor).to.equal(owner.address);
    expect(sale.assetAddress).to.equal(metaMintAddress);
    expect(sale.itemId).to.equal(metaMintTokenId);
    expect(sale.cost).to.equal(salePrice);
    expect(sale.available).to.be.true;
    
    // Current sale ID should be incremented
    expect(await marketplace.currentSaleId()).to.equal(2);
  });
  
  it("should create a sale for a Character NFT", async function () {
    // Create a sale
    const characterAddress = await characterNFT.getAddress();
    const doubleSalePrice = salePrice * BigInt(2);
    await marketplace.createSale(characterAddress, characterTokenId, doubleSalePrice);
    
    // Check sale details
    const sale = await marketplace.sales(1);
    
    expect(sale.vendor).to.equal(owner.address);
    expect(sale.assetAddress).to.equal(characterAddress);
    expect(sale.itemId).to.equal(characterTokenId);
    expect(sale.cost).to.equal(doubleSalePrice);
    expect(sale.available).to.be.true;
  });
  
  it("should prevent creating a sale for an NFT you don't own", async function () {
    // Try to create a sale as a different user
    const metaMintAddress = await metaMintNFT.getAddress();
    await expect(
      marketplace.connect(buyer).createSale(metaMintAddress, metaMintTokenId, salePrice)
    ).to.be.revertedWith("You are not the owner of this asset");
  });
  
  it("should allow removing a sale", async function () {
    // Create a sale
    const metaMintAddress = await metaMintNFT.getAddress();
    await marketplace.createSale(metaMintAddress, metaMintTokenId, salePrice);
    
    // Remove the sale
    await marketplace.removeSale(1);
    
    // Verify sale is no longer available
    const sale = await marketplace.sales(1);
    expect(sale.available).to.be.false;
  });
  
  it("should prevent non-vendors from removing a sale", async function () {
    // Create a sale
    const metaMintAddress = await metaMintNFT.getAddress();
    await marketplace.createSale(metaMintAddress, metaMintTokenId, salePrice);
    
    // Try to remove the sale as a different user
    await expect(
      marketplace.connect(buyer).removeSale(1)
    ).to.be.revertedWith("You are not the vendor");
  });
  
  it("should complete a sale when purchased with correct amount", async function () {
    // Create a sale
    const metaMintAddress = await metaMintNFT.getAddress();
    await marketplace.createSale(metaMintAddress, metaMintTokenId, salePrice);
    
    // Track balances for payment verification
    const initialSellerBalance = await ethers.provider.getBalance(owner.address);
    
    // Purchase the NFT as another user
    await marketplace.connect(buyer).purchaseNFT(1, {
      value: salePrice
    });
    
    // Verify ownership transferred
    expect(await metaMintNFT.ownerOf(metaMintTokenId)).to.equal(buyer.address);
    
    // Verify the sale is marked as unavailable
    const sale = await marketplace.sales(1);
    expect(sale.available).to.be.false;
    
    // Verify the seller received payment (approximately, due to gas costs)
    const finalSellerBalance = await ethers.provider.getBalance(owner.address);
    const balanceDifference = finalSellerBalance - initialSellerBalance;
    expect(balanceDifference).to.equal(salePrice);
  });
  
  it("should prevent purchasing a sale with incorrect payment", async function () {
    // Create a sale
    const metaMintAddress = await metaMintNFT.getAddress();
    await marketplace.createSale(metaMintAddress, metaMintTokenId, salePrice);
    
    // Try to purchase with less ETH
    await expect(
      marketplace.connect(buyer).purchaseNFT(1, {
        value: ethers.parseEther("0.5")
      })
    ).to.be.revertedWith("Incorrect ETH amount");
  });
  
  it("should prevent purchasing your own NFT", async function () {
    // Create a sale
    const metaMintAddress = await metaMintNFT.getAddress();
    await marketplace.createSale(metaMintAddress, metaMintTokenId, salePrice);
    
    // Try to purchase your own NFT
    await expect(
      marketplace.purchaseNFT(1, {
        value: salePrice
      })
    ).to.be.revertedWith("You can't buy your own NFT");
  });
});