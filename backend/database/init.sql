DROP TABLE IF EXISTS listings;
DROP TABLE IF EXISTS nfts;
DROP TABLE IF EXISTS offers;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS users;

-- Create the users table with address as the primary key
CREATE TABLE users (
    address VARCHAR(255) PRIMARY KEY,
    avatar_url VARCHAR(255) DEFAULT NULL,
    cover_url VARCHAR(255) DEFAULT NULL
);

-- Create the nfts table with token_id and owner_address
CREATE TABLE nfts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token_id INT NOT NULL UNIQUE, -- Ensures each token_id is unique
    owner_address VARCHAR(255) NOT NULL,
    metadata_url VARCHAR(255) NOT NULL,
    on_listing TINYINT(1) DEFAULT 0,
    FOREIGN KEY (owner_address) REFERENCES users(address) ON DELETE CASCADE
);

-- Create the transactions table to store blockchain transactions
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    from_account VARCHAR(255) NOT NULL,
    to_account VARCHAR(255) NOT NULL,
    value DECIMAL(10, 2) NOT NULL,
    transaction_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (from_account) REFERENCES users(address) ON DELETE CASCADE,
    FOREIGN KEY (to_account) REFERENCES users(address) ON DELETE CASCADE
);

-- Insert sample users
INSERT INTO users (address) VALUES 
('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'),
('0x70997970C51812dc3A010C7d01b50e0d17dc79C8'),
('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');

-- Create the tags table
CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- Insert sample tags
INSERT INTO tags (name) VALUES 
('Art'),
('Collectible'),
('Gaming'),
('Music'),
('Sports');

-- Create the listings table to store NFT listings
CREATE TABLE listings (
    listing_id INT AUTO_INCREMENT PRIMARY KEY,
    token_id INT NOT NULL,
    from_account VARCHAR(255) NOT NULL,
    price DECIMAL(65,0) NOT NULL,
    status ENUM('active', 'cancelled') DEFAULT 'active',
    listing_blockchain_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (token_id) REFERENCES nfts(token_id) ON DELETE CASCADE,
    FOREIGN KEY (from_account) REFERENCES users(address) ON DELETE CASCADE
);

-- Indexes to optimize query performance
CREATE INDEX idx_nft_owner ON nfts(owner_address);
CREATE INDEX idx_transaction_from ON transactions(from_account);
CREATE INDEX idx_transaction_to ON transactions(to_account);
CREATE INDEX idx_listing_status ON listings(status);