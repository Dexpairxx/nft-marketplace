// COS30049 Spring 2025 - Assignment 1 - Group 7
// Bui Minh Thuan  - 104486358
// Vu Minh An      - 104993133
// Trinh Nhan Kiet - 104988281

import React, { useState, useContext, useEffect } from "react";
import {
  Avatar, Box, Button, Typography, Tabs, Tab, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody
} from "@mui/material";
import { ethers } from "ethers";

import { UserContext } from "../../contexts/UserContext";
import useEthereumConnection from "../../hooks/useEthereumConnection";
import GridGallery from "../../components/gallery/GridGallery";
import LoadMoreButton from "../../components/buttons/LoadMoreButton";
import MainModal from "../../components/modals/MainModal";
import MintNftModal from "../../components/modals/MintNftModal";
import { fetchUserProfile, fetchUserTransaction } from "../../services/userService";
import { fetchNFTsByTab } from "../../services/nftService";

const ProfilePage = () => {
  const { user, setUser } = useContext(UserContext);
  const [userTransactions, setUserTransactions ] = useState([]);
  const [balance, setBalance] = useState(null);

  const [tabIndex, setTabIndex] = useState(0);
  const [nftIndex, setNftIndex] = useState(10);
  const [selectedNft, setSelectedNft] = useState(null);
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);

  const handleTabChange = (_, newIndex) => setTabIndex(newIndex);
  const onClickNft = (nft) => setSelectedNft(nft);
  const onLoadMore = () => setNftIndex((prev) => prev + 10);
  const onCloseModal = () => setSelectedNft(null);
  const onMintClick = () => setIsMintModalOpen(true);
  const onMintModalClose = () => setIsMintModalOpen(false);
  const [filteredNFTs, setFilteredNFTs] = useState([]);
  const [userProfile, setUserProfile] = useState({
    avatarUrl: "",
    coverUrl: "",
    balance: 0,
  });

  useEffect(() => {
    async function fetchBalance() {
      if (!window.ethereum) {
        console.error("MetaMask is not installed!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      if (accounts.length === 0) return;

      const account = accounts[0];
      const balance = await provider.getBalance(account);
      setBalance(ethers.formatEther(balance)); // Convert to ETH and store in state
    }

    fetchBalance();
  }, [user, tabIndex, isMintModalOpen]);
  
  useEffect(() => {
    const loadNFTs = async () => {
      if (user) {
        const nfts = await fetchNFTsByTab(user.account, tabIndex);
        setFilteredNFTs(nfts);
      }
    };
  
    loadNFTs();
  }, [user, tabIndex, isMintModalOpen]);

  useEffect(() => {
    if (user) {
      fetchUserProfile(user.account);
    }
  }, [user, tabIndex, isMintModalOpen]);

  // Check connection
  useEthereumConnection(setUser)

  // Update userTransactions to include nftId for later lookup.
  useEffect(() => {
    const loadTransactions = async () => {
      if (user) {
        try {
          // const response = await fetch(`/api/transactions?user=${user.account}`);
          console.log(user)
          const response = await fetchUserTransaction(user.account);
          console.log("User transactions:", response);
          if (response) {
            if (Array.isArray(response)) {
              setUserTransactions(response);
            } else if (typeof response === "object") {
              setUserTransactions([response]); 
            } else {
              console.error("Invalid response format:", response);
            }
            
          }
          else {
            setUserTransactions([]);
          }
        } catch (error) {
          console.error("Error fetching transactions:", error);
        }
      }
    };

    loadTransactions();
    console.log("User Transactions:", userTransactions);
  }, [user, tabIndex, isMintModalOpen]);

  useEffect(() => {
    console.log("Updated User Transactions:", userTransactions);
    console.log("userTransactions length:", typeof userTransactions);
  }, [userTransactions]);
  
  return (
    <Box sx={{ width: "100%", margin: "0 auto" }}>
      {/* Hero Section */}
      {user && (
        <Box
          sx={{
            height: { xs: "30vh", sm: "40vh" },
            backgroundImage: 'url("./cover_img.jpeg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
          }}
        >
          <Avatar
            // src={userProfile.avatarUrl}
            src="https://i.imgur.com/VsVTPGP.jpeg"
            sx={{
              width: { xs: "100px", sm: "150px" },
              height: { xs: "100px", sm: "150px" },
              position: "absolute",
              bottom: -40,
              left: 70,
              border: "4px solid white",
            }}
          />
        </Box>
      )}

      {/* Profile Info */}
      {user ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
            width: "90%",
            margin: "auto",
            mt: 10,
          }}
        >
          {/* Left Section: Account Info */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* User ID */}
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                mr: 2,
                fontSize: { xs: "15px", sm: "30px" },
              }}
            >
              {user.account.slice(0, 6) + "..." + user.account.slice(-4)}
            </Typography>

            {/* Wallet Amount */}
            <Box sx={{ bgcolor: "#ffbd31", p: 1, borderRadius: 1 }}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                }}
              >
                {balance} ETH
              </Typography>
            </Box>
          </Box>

          {/* Right Section: Action Button */}
          <Button
            variant="outlined"
            sx={{
              borderColor: "black",
              color: "black",
              borderRadius: "20px",
              borderWidth: "3px",
              fontSize: "0.8rem",
              "&:hover": { backgroundColor: "#FFD700" },
            }}
            onClick={() => onMintClick()}
          >
            MINT NFT
          </Button>
        </Box>
      ) : (
        <Typography
          variant="h6"
          color="gray"
          align="center"
          sx={{ mt: "130px" }}
        >
          Please connect to your wallet
        </Typography>
      )}

      {/* Tabs Section */}
      {user && (
        <>
          <Box
            sx={{
              mt: 3,
              ml: "5%",
              display: "flex",
              justifyContent: "flex-start",
              zIndex: 2,
              width: "90%",
            }}
          >
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              centered
              TabIndicatorProps={{
                style: {
                  backgroundColor: "orange",
                  height: "5px",
                  zIndex: 2,
                },
              }}
            >
              <Tab
                label="Owning"
                sx={{
                  "&.Mui-selected": { color: "orange", fontWeight: "bold" },
                  fontSize: { xs: "12px", sm: "12px", md: "16px", lg: "20px" },
                }}
              />
              <Tab
                label="Listing"
                sx={{
                  "&.Mui-selected": { color: "orange", fontWeight: "bold" },
                  fontSize: { xs: "12px", sm: "12px", md: "16px", lg: "20px" },
                }}
              />
              <Tab
                label="History"
                sx={{
                  "&.Mui-selected": { color: "orange", fontWeight: "bold" },
                  fontSize: { xs: "12px", sm: "12px", md: "16px", lg: "20px" },
                }}
              />
            </Tabs>
          </Box>
          <hr
            style={{
              width: "90%",
              border: "none",
              borderBottom: "1px solid gray",
              zIndex: 0,
              marginTop: "0px",
              transform: "translateY(-3px)",
            }}
          />

          {/* NFT Listings or History */}
          <Box sx={{ mt: 5, textAlign: "center" }}>
            {tabIndex !== 2 ? (
              filteredNFTs.length > 0 ? (
                <>
                  <GridGallery
                    nfts={filteredNFTs.slice(0, nftIndex)}
                    onClick={onClickNft}
                  />
                  {filteredNFTs.length > nftIndex && (
                    <LoadMoreButton onLoadMore={onLoadMore} />
                  )}
                </>
              ) : (
                <Typography variant="h6" color="gray">
                  No NFTs found
                </Typography>
              )
            ) : userTransactions.length > 0 ? (
              <TableContainer
                component={Paper}
                sx={{
                  gridTemplateColumns: {
                    xs: "repeat(2, 1fr)",
                    sm: "repeat(3, 1fr)",
                    md: "repeat(4, 1fr)",
                    lg: "repeat(6, 1fr)",
                  },
                  gap: 2,
                  mt: 4,
                  px: "5%",
                  "&:last-child": { paddingBottom: "50px" },
                }}
              >
                <Table>
                  <TableHead
                    sx={{
                      backgroundColor: "#ffad00",
                      fontWeight: "bold",
                    }}
                  >
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                        Type
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                        From
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                        To
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                        Value
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                        Transaction Hash
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                        Time
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userTransactions.map((tx, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          backgroundColor:
                            index % 2 === 1 ? "#f5f5f5" : "inherit",
                        }}
                      >
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            color:
                              tx.type === "mint"
                                ? "black"
                                : tx.type === "listing"
                                  ? "red"
                                : tx.type === "transfer"
                                  ? "green"
                                  : "inherit",
                          }}
                        >
                          {tx.type}
                        </TableCell>

                        <TableCell
                          sx={{
                            color:
                              tx.from_account === user.account ? "green" : "inherit",
                          }}
                        >
                          {tx.from_account === user.account
                            ? tx.from_account
                            : `${tx.from_account.slice(0, 6)}...${tx.from_account.slice(
                              -4
                            )}`}
                        </TableCell>
                        <TableCell
                          sx={{
                            color:
                              tx.to_account === user.account ? "green" : "inherit",
                          }}
                        >
                          {tx.to_account === user.account
                            ? tx.to_account
                            : `${tx.to_account.slice(0, 6)}...${tx.to_account.slice(-4)}`}
                        </TableCell>
                        <TableCell
                          sx={{
                            color:
                              tx.type === "Sell"
                                ? "green"
                                : tx.type === "Buy"
                                  ? "red"
                                  : "inherit",
                          }}
                        >
                          {tx.type === "Sell"
                            ? `+ ${tx.value}`
                            : tx.type === "Buy"
                              ? `– ${tx.value}`
                              : tx.value}
                        </TableCell>
                        <TableCell
                        >
                          {`${tx.transaction_hash.slice(0, 6)}...${tx.transaction_hash.slice(-4)}`}
                        </TableCell>
                        <TableCell>{tx.created_at}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="h6" color="gray">
                No Transactions found
              </Typography>
            )}
          </Box>

          {/* Modals */}
          {tabIndex === 0 && selectedNft && (
            <MainModal nft={selectedNft} onClose={onCloseModal} type="selling" />
          )}
          {tabIndex === 1 && selectedNft && (
            <MainModal nft={selectedNft} onClose={onCloseModal} type="listing" />
          )}
          {tabIndex === 2 && selectedNft && (
            <MainModal nft={selectedNft} onClose={onCloseModal} type="detail" />
          )}
          <MintNftModal open={isMintModalOpen} onClose={onMintModalClose} />
        </>
      )}
    </Box>
  );
};

export default ProfilePage;