const conn = require("../../database/database");

// Controller function to get all tags
const getAllTags = async (req, res) => {
  try {
    const [rows] = await conn.execute("SELECT * FROM tags");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getAllTags };