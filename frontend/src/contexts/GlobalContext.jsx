// COS30049 Spring 2025 - Assignment 1 - Group 7
// Bui Minh Thuan  - 104486358
// Vu Minh An      - 104993133
// Trinh Nhan Kiet - 104988281

import { createContext } from "react";
import { UserProvider } from './UserContext';
import { AccountProvider } from './AccountContext';
import { NftProvider } from "./NftContext";
import { TransactionProvider } from "./TransactionContext";

// Context for the global state
export const GlobalContext = createContext();

// GlobalProvider component that wraps all the context providers
export function GlobalProvider({ children }) {
  return (
    <AccountProvider>
      <UserProvider>
        <NftProvider>
          <TransactionProvider>
            {children}
          </TransactionProvider>
        </NftProvider>
      </UserProvider>
    </AccountProvider>
  );
}