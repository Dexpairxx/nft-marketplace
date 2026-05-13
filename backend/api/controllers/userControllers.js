const conn = require("../../database/database");

// Controller to get user profile data by address
const getUserProfile = async (req, res) => {
  const address = req.params.address;

  console.log("Fetching user profile for address:", address);

  try {
    const query = "SELECT avatar_url, cover_url FROM users WHERE address = ?";
    const [result] = await conn.execute(query, [address]);

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(result[0]);
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Controller to get user profile data by address
const getUserTransaction = async (req, res) => {
  const address = req.params.address;

  console.log("Fetching transactions for address:", address);

  try {
    const query = "SELECT * FROM transactions WHERE from_account = ? OR to_account = ?";
    const [result] = await conn.execute(query, [address, address]);

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(result[0]);
  } catch (error) {
    console.error("Error fetching user transaction:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getUserProfile, getUserTransaction };