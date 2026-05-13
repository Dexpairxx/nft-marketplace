// COS30049 Spring 2025 - Assignment 1 - Group 7
// Bui Minh Thuan  - 104486358
// Vu Minh An      - 104993133
// Trinh Nhan Kiet - 104988281

import { useContext, createContext, useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import { AccountContext } from "./AccountContext";
import { NftContext } from "./NftContext";

import { Transactions } from "../data/Transactions.jsx";

export const TransactionContext = createContext();

export function TransactionProvider({ children }) {
  const { updateUserBalance } = useContext(UserContext);
  const { updateAccountBalance } = useContext(AccountContext);
  const { updateNftOwner } = useContext(NftContext);
  const [transactions, setTransactions] = useState(
    JSON.parse(sessionStorage.getItem("transactions")) || Transactions
  );

  useEffect(() => {
    sessionStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Add new offer 
  const addOffer = (nftId, offeringAccount, price) => {
    setTransactions((prev) => {
      const updatedTransactions = prev.map((tx) =>
        tx.nftId === nftId && tx.status === "listing"
          ? {
            ...tx,
            offers: [...tx.offers, {
              fromAccount: offeringAccount, amount: price, status: "approving", time: new Date(Date.now()).toLocaleString()
            }],
          }
          : tx
      );

      setTimeout(() => {
        sessionStorage.setItem("transactions", JSON.stringify(updatedTransactions));
      }, 0);

      // Updata balance (take money from offering account)
      updateUserBalance(-price);
      updateAccountBalance(offeringAccount, -price);

      return updatedTransactions;
    });
  };

  const updateOfferPrice = (nftId, offeringAccount, newPrice) => {
    setTransactions((prev) => {
      let isUpdated = false;

      const updatedTransactions = prev.map((tx) => {
        if (tx.nftId === nftId && tx.status === "listing") {
          const updatedOffers = tx.offers.map((offer) => {
            if (offer.fromAccount === offeringAccount && offer.status === "approving") {
              isUpdated = true;
              return { ...offer, amount: newPrice, time: new Date(Date.now()).toLocaleString() };
            }
            return offer;
          });

          return { ...tx, offers: updatedOffers };
        }

        return tx;
      });

      if (isUpdated) {
        sessionStorage.setItem("transactions", JSON.stringify(updatedTransactions));
      }

      return updatedTransactions;
    });
  };

  // Add new transaction
  // Anything user does is considered as transaction
  const addTransaction = (nftId, fromAccount, basePrice) => {
    setTransactions((prev) => {
      const newTransaction = {
        nftId,
        fromAccount,
        basePrice,
        offers: [],
        status: "listing",
      };
      const updatedTransactions = [...prev, newTransaction];
      setTimeout(() => {
        sessionStorage.setItem("transactions", JSON.stringify(updatedTransactions));
      }, 0);
      return updatedTransactions;
    });
  };

  // Update base price for a transaction
  const updateTransactionBasePrice = (nftId, newBasePrice) => {
    setTransactions((prev) => {
      const updatedTransactions = prev.map((tx) =>
        tx.nftId === nftId && tx.status === "listing" ? { ...tx, basePrice: newBasePrice } : tx
      );

      setTimeout(() => {
        sessionStorage.setItem("transactions", JSON.stringify(updatedTransactions));
      }, 0);

      return updatedTransactions;
    });
  };

  // Get current Price of an offer
  const getCurrentOfferPrice = (nftId, offeringAccount) => {
    const transaction = transactions.find((tx) => tx.nftId === nftId && tx.status === "listing");
    if (!transaction) return null;

    const offer = transaction.offers.find((offer) => offer.fromAccount === offeringAccount && offer.status === "approving");
    return offer ? offer.amount : null;
  };

  // Cancel an offer
  const cancelOffer = (nftId, offeringAccount) => {
    setTransactions((prev) => {
      let refundAmount = 0;

      const updatedTransactions = prev.map((tx) => {
        if (tx.nftId !== nftId || tx.status !== "listing") return tx;

        const updatedOffers = tx.offers.map((offer) => {
          if (offer.fromAccount === offeringAccount && offer.status === "approving") {
            refundAmount = offer.amount;
            return { ...offer, status: "cancelled", time: new Date(Date.now()).toLocaleString() };
          }
          return offer;
        });

        return { ...tx, offers: updatedOffers };
      });

      // Refund 
      if (refundAmount > 0) {
        updateUserBalance(refundAmount);
        updateAccountBalance(offeringAccount, refundAmount);
      }

      setTimeout(() => {
        sessionStorage.setItem("transactions", JSON.stringify(updatedTransactions));
      }, 0);

      return updatedTransactions;
    });
  };

  // Approve an offer
  const approveOffer = (nftId, seller, receiver) => {
    setTransactions((prev) => {
      if (!Array.isArray(prev)) return prev;

      return prev.map((tx) => {
        if (tx.nftId !== nftId || tx.status !== "listing") return tx;

        const chosenOffer = tx.offers.find((offer) => offer.fromAccount === receiver && offer.status === "approving");
        if (!chosenOffer) return tx;

        const updatedOffers = tx.offers.map((offer) =>
          offer.fromAccount === receiver
            ? { ...offer, status: "approved", time: new Date(Date.now()).toLocaleString() }
            : { ...offer, status: "disapproved", time: new Date(Date.now()).toLocaleString() }
        );
        
        // Refund money for disaproved offer
        updatedOffers.forEach((offer) => {
          if (offer.status === "disapproved") {
            updateAccountBalance(offer.fromAccount, offer.amount);
          }
        });

        setTimeout(() => {
          sessionStorage.setItem(
            "transactions",
            JSON.stringify(prev.map((t) => (t.nftId === nftId ? { ...t, status: "finished", offers: updatedOffers } : t)))
          );
        }, 0);

        // Take money
        updateUserBalance(chosenOffer.amount);
        updateAccountBalance(seller, chosenOffer.amount);

        // Update Nft ownership
        updateNftOwner(nftId, receiver);

        return { ...tx, status: "finished", offers: updatedOffers };
      });
    });
  };

  const cancelListing = (nftId) => {
    setTransactions((prev) => {
      const updatedTransactions = prev.map((tx) => {
        if (tx.nftId === nftId && tx.status === "listing") {
          const updatedOffers = tx.offers.map((offer) => {
            if (offer.status === "approving") {
              // Refund money
              updateAccountBalance(offer.fromAccount, offer.amount);

              // Mark offer as disapproved
              return { ...offer, status: "disapproved", time: new Date(Date.now()).toLocaleString() };
            }
            return offer;
          });
  
          return {
            ...tx,
            status: "cancelled",
            offers: updatedOffers,
          };
        }
        return tx;
      });
  
      setTimeout(() => {
        sessionStorage.setItem("transactions", JSON.stringify(updatedTransactions));
      }, 0);
  
      return updatedTransactions;
    });
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        cancelListing,
        addOffer,
        updateOfferPrice,
        cancelOffer,
        getCurrentOfferPrice,
        updateTransactionBasePrice,
        approveOffer
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}