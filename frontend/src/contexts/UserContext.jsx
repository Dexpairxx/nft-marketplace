// COS30049 Spring 2025 - Assignment 1 - Group 7
// Bui Minh Thuan  - 104486358
// Vu Minh An      - 104993133
// Trinh Nhan Kiet - 104988281

import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    // load user from session storage
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
    // return {"account":"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266","balance":"10000","privateKey":"0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"}
  });

  // Update sessionStorage when change user
  useEffect(() => {
    if (user) {
      sessionStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("user");
    }
  }, [user]);

  const updateUserBalance = (amount) => {
    setUser((prevUser) => {
      if (!prevUser) return prevUser;

      const updatedUser = { ...prevUser, balance: Number(prevUser.balance) + Number(amount) };

      setTimeout(() => {
        sessionStorage.setItem("user", JSON.stringify(updatedUser));
      }, 0);

      return updatedUser;
    });
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateUserBalance }}>
      {children}
    </UserContext.Provider>
  );
}