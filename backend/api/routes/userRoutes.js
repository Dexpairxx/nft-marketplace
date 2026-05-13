const express = require("express");
const router = express.Router();
const { getUserProfile, getUserTransaction } = require("../controllers/userControllers");

// Route to get user profile by address
router.get("/address/:address", getUserProfile);

// Route to get user transactions by address
router.get("/address/:address/transaction", getUserTransaction);

module.exports = router;