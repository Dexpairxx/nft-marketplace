// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BaseNFT
 * @dev Abstract base contract for NFT implementations
 */
abstract contract BaseNFT is ERC721URIStorage, Ownable {
    uint256 public immutable MAX_SUPPLY;
    uint256 public immutable MAX_MINT_PER_ADDRESS;
    uint256 internal _tokenIds;
    mapping(address => uint256) internal _mintedPerAddress;
    address public marketplace;

    event MintedNewNFT(
        uint256 indexed tokenId,
        address indexed owner,
        string tokenURI
    );

    /**
     * @dev Constructor for BaseNFT
     * @param name Name of the NFT collection
     * @param symbol Symbol of the NFT collection
     * @param maxSupply Maximum number of NFTs that can be minted
     * @param maxMintPerAddress Maximum NFTs a single address can mint
     * @param _marketplace Address of the marketplace contract
     */
    constructor(
        string memory name,
        string memory symbol,
        uint256 maxSupply,
        uint256 maxMintPerAddress,
        address _marketplace
    ) ERC721(name, symbol) Ownable(msg.sender) {
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

    /**
     * @dev Internal function to mint an NFT
     * @param recipient Address receiving the NFT
     * @param tokenURI URI for token metadata
     * @return newTokenId ID of the newly minted token
     */
    function _mintNFTInternal(address recipient, string memory tokenURI) internal returns (uint256) {
        require(_tokenIds < MAX_SUPPLY, "Max supply reached");
        require(
            _mintedPerAddress[recipient] < MAX_MINT_PER_ADDRESS,
            "Mint limit per address reached"
        );
        
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        _safeMint(recipient, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        _mintedPerAddress[recipient]++;
        
        if (marketplace != address(0)) {
            approve(marketplace, newTokenId);
        }
        
        emit MintedNewNFT(newTokenId, recipient, tokenURI);
        return newTokenId;
    }

    /**
     * @dev Public mint function (to be implemented by child contracts)
     * @param tokenURI URI for token metadata
     */
    function mintNFT(string memory tokenURI) public virtual returns (uint256) {
        return _mintNFTInternal(msg.sender, tokenURI);
    }
    
    /**
     * @dev Get how many NFTs have been minted by an address
     * @param owner Address to check
     * @return Number of NFTs minted
     */
    function mintedByAddress(address owner) public view returns (uint256) {
        return _mintedPerAddress[owner];
    }
    
    /**
     * @dev Update the marketplace address
     * @param _marketplace New marketplace address
     */
    function setMarketplace(address _marketplace) external onlyOwner {
        marketplace = _marketplace;
    }
}