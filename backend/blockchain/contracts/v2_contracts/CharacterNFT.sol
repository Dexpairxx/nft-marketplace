// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./BaseNFT.sol";
    
/**
 * @title CharacterNFT
 * @dev Game character NFT implementation with additional attributes
 */
contract CharacterNFT is BaseNFT {
    // Character attributes
    struct CharacterAttributes {
        uint8 level;
        uint16 strength;
        uint16 agility;
        uint16 intelligence;
        string characterClass;
        uint32 experience;
    }
    
    // Mapping from token ID to character attributes
    mapping(uint256 => CharacterAttributes) public characterAttributes;
    
    // Event for character level up
    event CharacterLevelUp(uint256 indexed tokenId, uint8 newLevel);
    
    /**
     * @dev Constructor for CharacterNFT
     * @param maxSupply Maximum number of NFTs that can be minted
     * @param maxMintPerAddress Maximum NFTs a single address can mint
     * @param _marketplace Address of the marketplace contract
     */
    constructor(
        uint256 maxSupply,
        uint256 maxMintPerAddress,
        address _marketplace
    ) BaseNFT("GameCharacterNFT", "GCNFT", maxSupply, maxMintPerAddress, _marketplace) {}
    
    /**
     * @dev Mint a new character NFT with attributes
     * @param tokenURI URI for token metadata
     * @param _class Character class (e.g., "Warrior", "Mage", "Archer")
     * @param _strength Initial strength value
     * @param _agility Initial agility value
     * @param _intelligence Initial intelligence value
     * @return The ID of the newly minted token
     */
    function mintCharacterNFT(
        string memory tokenURI, 
        string memory _class,
        uint16 _strength,
        uint16 _agility,
        uint16 _intelligence
    ) public returns (uint256) {
        uint256 tokenId = super.mintNFT(tokenURI);
        
        // Initialize character attributes
        characterAttributes[tokenId] = CharacterAttributes({
            level: 1,
            strength: _strength,
            agility: _agility,
            intelligence: _intelligence,
            characterClass: _class,
            experience: 0
        });
        
        return tokenId;
    }
    
    /**
     * @dev Standard mintNFT with default character attributes
     * @param tokenURI URI for token metadata
     * @return The ID of the newly minted token
     */
    function mintNFT(string memory tokenURI) public override returns (uint256) {
        // Default to a balanced character for demonstration only
        return mintCharacterNFT(tokenURI, "Adventurer", 10, 10, 10);
    }
    
    /**
     * @dev Add experience to a character (only callable by owner of the character)
     * @param tokenId ID of the character token
     * @param experiencePoints Amount of experience to add
     */
    function addExperience(uint256 tokenId, uint32 experiencePoints) external {
        require(ownerOf(tokenId) == msg.sender, "Only character owner can add experience");
        
        CharacterAttributes storage character = characterAttributes[tokenId];
        character.experience += experiencePoints;
        
        // Level up logic (simple example)
        uint8 newLevel = uint8(1 + (character.experience / 1000));
        
        if (newLevel > character.level) {
            character.level = newLevel;
            
            // Increase stats on level up
            character.strength += 2;
            character.agility += 2;
            character.intelligence += 2;
            
            emit CharacterLevelUp(tokenId, newLevel);
        }
    }
    
    /**
     * @dev Get character attributes
     * @param tokenId ID of the character token
     * @return Character attributes struct
     */
    function getCharacterAttributes(uint256 tokenId) external view returns (CharacterAttributes memory) {
        require(_ownerOf(tokenId) != address(0), "Character does not exist");
        return characterAttributes[tokenId];
    }
}