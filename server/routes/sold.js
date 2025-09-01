const express = require("express");
const router = express.Router();
const {
  sellBike,
  getSoldBikes,
  updateSoldBike,
  deleteSoldBike,
} = require("../controllers/soldController");

// Mark a bike as sold
router.post("/:bikeId/sell", sellBike);

// Get all sold bikes
router.get("/", getSoldBikes);

// Update sold bike
router.put("/:id", updateSoldBike);

// Delete sold bike (optional)
router.delete("/:id", deleteSoldBike);

module.exports = router;
