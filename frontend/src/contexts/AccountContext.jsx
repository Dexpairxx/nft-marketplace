// COS30049 Spring 2025 - Assignment 1 - Group 7
// Bui Minh Thuan  - 104486358
// Vu Minh An      - 104993133
// Trinh Nhan Kiet - 104988281

import { createContext, useState, useEffect } from "react";
import { Accounts } from "../data/Accounts.jsx";

// Context for account information
export const AccountContext = createContext();

export function AccountProvider({ children }) {
  // Initialize accounts state with data from sessionStorage or default Accounts
  const [accounts, setAccounts] = useState(JSON.parse(sessionStorage.getItem("accounts")) || Accounts);

  // Sync accounts state with sessionStorage when changes
  useEffect(() => {
    sessionStorage.setItem("accounts", JSON.stringify(accounts));
  }, [accounts]);

  // Update the balance of a specific account
  const updateAccountBalance = (accountAddress, amount) => {
    setAccounts(accounts => {
      const updatedAccounts = accounts.map(account =>
        account.account === accountAddress
          ? { ...account, balance: Number(account.balance) + amount }
          : account
      );

      // Update sessionStorage with the new accounts data
      setTimeout(() => {
        sessionStorage.setItem("accounts", JSON.stringify(updatedAccounts));
      }, 0);

      return updatedAccounts;
    });
  };

  return (
    <AccountContext.Provider value={{ accounts, setAccounts, updateAccountBalance }}>
      {children}
    </AccountContext.Provider>
  );
}