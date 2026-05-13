// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./BaseNFT.sol";

/**
 * @title MetaMintNFT
 * @dev Implementation of BaseNFT for the MetaMint collection
 */
contract MetaMintNFT is BaseNFT {
    /**
     * @dev Constructor for MetaMintNFT
     * @param maxSupply Maximum number of NFTs that can be minted
     * @param maxMintPerAddress Maximum NFTs a single address can mint
     * @param _marketplace Address of the marketplace contract
     */
    constructor(
        uint256 maxSupply,
        uint256 maxMintPerAddress,
        address _marketplace
    ) BaseNFT("MetaMintNFT", "MMNFT", maxSupply, maxMintPerAddress, _marketplace) {}

    /**
     * @dev Mint a new MetaMint NFT
     * @param tokenURI URI for token metadata
     * @return The ID of the newly minted token
     */
    function mintNFT(string memory tokenURI) public override returns (uint256) {
        // This directly uses the base implementation
        // Additional MetaMint-specific logic could be added here if needed
        return super.mintNFT(tokenURI);
    }
}