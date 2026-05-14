-- Demo seed data for MetaMint NFT Marketplace

INSERT IGNORE INTO users (address) VALUES
('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'),
('0x70997970C51812dc3A010C7d01b50e0d17dc79C8'),
('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');

INSERT IGNORE INTO nfts (token_id, owner_address, metadata_url, on_listing) VALUES
(1, '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', 'https://gateway.pinata.cloud/ipfs/QmaoPhqEW1AvbFRMXRXYUXa5eoSMhn3J7RaHEgvCA3YoY1', 1),
(2, '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', 'https://gateway.pinata.cloud/ipfs/QmS7CUxvjyisb4GWMXqxzhoXRX6yadjvvVdfThWjSCTCZu', 1),
(3, '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', 'https://gateway.pinata.cloud/ipfs/QmRtvxsMKMpoqaPYVZn69gfmEScH6aNWmRGwyCVuELXTW7', 1),
(4, '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', 'https://gateway.pinata.cloud/ipfs/QmVxPKcsYtw6MRXHEjbeEEEGVSuDcj71zEpsyQTETEiByV', 0),
(5, '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 'https://gateway.pinata.cloud/ipfs/QmTKAap9pyMotJ6uTKWkN4UdBC7bQGn7HoZPo2WSdQysCc', 1),
(6, '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 'https://gateway.pinata.cloud/ipfs/QmX7v1CbfqWRDntYWb19FVvnW8BLsBFr2qyaFxe6gDwcHv', 0);

INSERT IGNORE INTO listings (token_id, from_account, price, status, listing_blockchain_id) VALUES
(1, '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', 50000000000000000, 'active', 1),
(2, '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', 120000000000000000, 'active', 2),
(3, '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', 80000000000000000, 'active', 3),
(5, '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 200000000000000000, 'active', 4);
