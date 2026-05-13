// SPDX-License-Identifier: MIT
// COS30049 Spring 2025 - Assignment 2 - Group 7
// Bui Minh Thuan  - 104486358
// Vu Minh An      - 104993133
// Trinh Nhan Kiet - 104988281

pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MetaMintNFT is ERC721URIStorage, Ownable {
    uint256 public immutable MAX_SUPPLY;
    uint256 public immutable MAX_MINT_PER_ADDRESS;
    uint256 private _tokenIds;
    mapping(address => uint256) private _mintedPerAddress;
    address public marketplace;
    event mintedNewNFT(
        uint256 indexed tokenId,
        address indexed owner,
        string tokenURI
    );

    constructor(
        uint256 maxSupply,
        uint256 maxMintPerAddress,
        address _marketplace
    ) ERC721("MetaMintNFT", "MMNFT") Ownable(msg.sender) {
        require(maxSupply > 0, "Max supply must be greater than 0");
        require(
            maxMintPerAddress > 0,
            "Max mint per address must be greater than 0"
        );
        require(
            maxMintPerAddress <= maxSupply,
            "Max mint per address must be lower than max supply"
        );

        MAX_SUPPLY = maxSupply;
        MAX_MINT_PER_ADDRESS = maxMintPerAddress;
        marketplace = _marketplace;
    }

    function mintNFT(string memory tokenURI) public returns (uint256) {
        require(_tokenIds < MAX_SUPPLY, "Max supply reached");
        require(
            _mintedPerAddress[msg.sender] < MAX_MINT_PER_ADDRESS,
            "Mint limit per address reached"
        );

        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        _mintedPerAddress[msg.sender]++;

        if (marketplace != address(0)) {
            approve(marketplace, newTokenId);
        }

        emit mintedNewNFT(newTokenId, msg.sender, tokenURI);
        return newTokenId;
    }
}
