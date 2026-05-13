const express = require("express");

const router = express.Router();
const { getAllTags } = require("../controllers/tagControllers");

// Route get all tags
router.get("/", getAllTags);

module.exports = router;