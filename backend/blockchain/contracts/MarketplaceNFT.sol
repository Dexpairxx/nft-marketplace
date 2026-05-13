// SPDX-License-Identifier: MIT
// COS30049 Spring 2025 - Assignment 2 - Group 7
// Bui Minh Thuan  - 104486358
// Vu Minh An      - 104993133
// Trinh Nhan Kiet - 104988281

pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract MarketplaceNFT is ReentrancyGuard {
    struct Sale {
        address vendor;
        address assetAddress;
        uint256 itemId;
        uint256 cost;
        bool available;
    }

    uint256 public currentSaleId = 1;

    // saleId => Sale
    mapping(uint256 => Sale) public sales;

    // Events
    event SaleCreated(
        uint256 indexed saleId,
        address indexed vendor,
        address indexed assetAddress,
        uint256 itemId,
        uint256 cost
    );
    event SaleRemoved(uint256 indexed saleId, address indexed vendor);
    event SaleCompleted(
        uint256 indexed saleId,
        address indexed buyer,
        address indexed vendor,
        address assetAddress,
        uint256 itemId,
        uint256 cost
    );

    // Listing NFTs
    function createSale(
        address assetAddress,
        uint256 itemId,
        uint256 cost
    ) external nonReentrant {
        require(cost > 0, "Cost must be greater than 0");

        IERC721 asset = IERC721(assetAddress);
        require(
            asset.ownerOf(itemId) == msg.sender,
            "You are not the owner of this asset"
        );
        require(
            asset.getApproved(itemId) == address(this),
            "Marketplace not authorized"
        );

        sales[currentSaleId] = Sale({
            vendor: msg.sender,
            assetAddress: assetAddress,
            itemId: itemId,
            cost: cost,
            available: true
        });

        emit SaleCreated(currentSaleId, msg.sender, assetAddress, itemId, cost);
        currentSaleId++;
    }

    // Removing a sale
    function removeSale(uint256 saleId) external nonReentrant {
        Sale storage sale = sales[saleId];
        require(sale.available, "Sale not available");
        require(sale.vendor == msg.sender, "You are not the vendor");

        sale.available = false;
        emit SaleRemoved(saleId, msg.sender);
    }

    // Purchasing an NFT
    function purchaseNFT(uint256 saleId) external payable nonReentrant {
        Sale storage sale = sales[saleId];
        // require(sale.available, "Sale not available");
        require(msg.value == sale.cost, "Incorrect ETH amount");
        require(sale.vendor != msg.sender, "You can't buy your own NFT");

        IERC721 asset = IERC721(sale.assetAddress);
        require(
            asset.ownerOf(sale.itemId) == sale.vendor,
            "Vendor no longer owns this asset"
        );

        sale.available = false;

        asset.safeTransferFrom(sale.vendor, msg.sender, sale.itemId);
        payable(sale.vendor).transfer(msg.value);

        emit SaleCompleted(
            saleId,
            msg.sender,
            sale.vendor,
            sale.assetAddress,
            sale.itemId,
            sale.cost
        );
    }
}
