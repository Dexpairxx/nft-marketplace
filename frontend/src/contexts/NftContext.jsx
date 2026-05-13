// COS30049 Spring 2025 - Assignment 1 - Group 7
// Bui Minh Thuan  - 104486358
// Vu Minh An      - 104993133
// Trinh Nhan Kiet - 104988281

import { createContext, useState, useEffect } from "react";
import { Nfts } from "../data/Nfts.jsx";

export const NftContext = createContext();

export function NftProvider({ children }) {
  const [nfts, setNfts] = useState(JSON.parse(sessionStorage.getItem("nfts")) || Nfts);

  useEffect(() => {
    sessionStorage.setItem("nfts", JSON.stringify(nfts));
  }, [nfts]);

  const updateNftStatus = (nftId, status) => {
    setNfts((prevNfts) => {
      const updatedNfts = prevNfts.map((nft) =>
        nft.id === nftId ? { ...nft, status } : nft
      );
      sessionStorage.setItem("nfts", JSON.stringify(updatedNfts));
      return updatedNfts;
    });
  };

  const updateNftOwner = (nftId, newOwner) => {
    setNfts((prevNfts) => {
      const updatedNfts = prevNfts.map((nft) =>
        nft.id === nftId ? { ...nft, owner: newOwner } : nft
      );
      sessionStorage.setItem("nfts", JSON.stringify(updatedNfts));
      return updatedNfts;
    });
  };

  return (
    <NftContext.Provider value={{ nfts, setNfts, updateNftStatus, updateNftOwner }}>
      {children}
    </NftContext.Provider>
  );
}