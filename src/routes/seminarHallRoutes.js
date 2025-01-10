const express = require("express");
const mongoose = require("mongoose");
const SeminarHall = require("../models/seminarHallModel");
const router = express.Router();

// Get all seminar halls
router.get("/", async (req, res) => {
    try {
      const halls = await SeminarHall.find();
      
      // Add a sequential display ID (1, 2, 3, etc.) to each seminar hall
      const hallsWithDisplayId = halls.map((hall, index) => ({
        ...hall.toObject(),
        displayId: index + 1, // Sequential ID starting from 1
      }));
  
      res.status(200).json(hallsWithDisplayId);
    } catch (err) {
      res.status(500).json({ message: "Error fetching seminar halls", error: err.message });
    }
  });
  

// Get seminar hall by ID
router.get("/:id", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(500).json({ message: "Database is not connected" });
  }

  try {
    const hall = await SeminarHall.findById(req.params.id);
    if (!hall) return res.status(404).json({ message: "Seminar hall not found" });
    res.status(200).json(hall);
  } catch (err) {
    res.status(500).json({ message: "Error fetching seminar hall", error: err.message });
  }
});

module.exports = router;
