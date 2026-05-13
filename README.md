# Assignment 3 Updates: Instruction to run tests
To run the tests for newly created smart contracts, please navigate to the `backend/blockchain/test` directory and run the following command:

```bash
npx hardhat test
```
Other features still works as normal. You can refer to the instructions below to run the project.

# NFT Marketplace - Deployment & Usage Guide

## Project Overview
This project is a decentralized NFT Marketplace built with Solidity, Hardhat, Express.js (Node.js), and a React-based frontend. It allows users to mint, list, and purchase NFTs seamlessly on a blockchain network.

---

## Prerequisites
Before running the project, ensure you have the following installed:
- **Node.js** (Latest LTS version recommended)
- **npm**
- **MetaMask Chrome Extension** (Ensure it's installed and connected to your Hardhat local blockchain)
- **MySQL Database** (Ensure MySQL is installed and running)

---

## Deployment Instructions

### 1. Set Up Environment Files
Create `.env` files for both the backend and frontend.

#### Backend `.env`
Create a file named `.env` inside the `/backend` folder and add the following content:
```env
# Pinata API key and secret key to upload files
PINATA_API_KEY="a0a89372c0c6fb315bfc"
PINATA_SECRET_API_KEY="9e6aa0cacab9449491fff9233d216d5e230926f0a053957e685709ed7e9dc2da"

# Backend Port
PORT=5001

# MySQL Config (Modify these values to match your MySQL setup)
DB_HOST="localhost"
DB_USER="group7"
DB_PASSWORD="yourpassword"
DB_NAME="cos30049"
DB_PORT=3306

# Hardhat RPC URL
RPC_URL="http://127.0.0.1:8545"

```
Note: Your should modify the MYSQL database credentials to match their system.

#### Frontend `.env`

Create another .env file inside the /frontend folder:

```
# API URL for Backend
VITE_API_URL=http://localhost:5001
```

## 2. Initialize Database

Run the provided SQL script to create the necessary tables:

script located in: backend/database/innit.sql
