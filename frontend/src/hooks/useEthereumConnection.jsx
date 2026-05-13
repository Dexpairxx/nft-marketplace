import { useEffect } from "react";

const useEthereumConnection = (setUser) => {
  useEffect(() => {
    const checkEthereumConnection = async () => {
      if (!window.ethereum) {
        setUser(null);
        return;
      }

      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length === 0) {
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking Ethereum connection:", error);
        setUser(null);
      }
    };

    checkEthereumConnection();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", checkEthereumConnection);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", checkEthereumConnection);
      }
    };
  }, [setUser]);
};

export default useEthereumConnection;