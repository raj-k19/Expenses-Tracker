const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { setBudget, getSummary } = require("../controllers/budgetController.js");

router.post("/", protect, setBudget);
router.get("/summary", protect, getSummary);

module.exports = router; 