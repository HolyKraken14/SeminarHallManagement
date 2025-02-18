const express = require("express");
const SeminarHall = require("../models/seminarHallModel");
const router = express.Router();
const seedDatabase = require("../config/seedSeminarHall");

// Get all seminar halls
router.get("/", async (req, res) => {
  try {
    const seminarHalls = await SeminarHall.find();
    res.json(seminarHalls);
  } catch (err) {
    res.status(500).json({ message: "Error fetching seminar halls", error: err });
  }
});

// Get a single seminar hall by displayId
router.get("/:id", async (req, res) => {
  try {
    const hallId = req.params.id;

    const hall = await SeminarHall.findById(hallId) 

    if (!hall) {
      return res.status(404).json({ message: "Seminar hall not found" });
    }

    const halls = await SeminarHall.find();
    const displayId = halls.findIndex((h) => h._id.toString() === hall._id.toString()) + 1;

    const hallWithDisplayId = {
      ...hall.toObject(),
      displayId,
    };

    res.status(200).json(hallWithDisplayId);
  } catch (err) {
    console.error("Error fetching seminar hall:", err);
    res.status(500).json({ message: "Error fetching seminar hall", error: err.message });
  }
});


// Get seminar halls with specific equipment condition (optional)
router.get("/equipment/:condition", async (req, res) => {
  try {
    const seminarHalls = await SeminarHall.find({
      "equipment.condition": req.params.condition,
    });
    if (!seminarHalls.length) {
      return res.status(404).json({ message: "No seminar halls found with this equipment condition" });
    }
    res.json(seminarHalls);
  } catch (err) {
    res.status(500).json({ message: "Error fetching seminar halls by equipment condition", error: err });
  }
});

// Add this route to update availability (admin only)
router.patch("/:id/availability", async (req, res) => {
  try {
    const { isAvailable, unavailabilityReason } = req.body;
    const hallId = req.params.id;

    const hall = await SeminarHall.findById(hallId);
    if (!hall) {
      return res.status(404).json({ message: "Seminar hall not found" });
    }

    hall.isAvailable = isAvailable;
    hall.unavailabilityReason = unavailabilityReason;
    await hall.save();

    res.status(200).json({
      message: `Seminar hall ${isAvailable ? 'enabled' : 'disabled'} successfully`,
      hall
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating seminar hall availability", error: err.message });
  }
});


module.exports = router;

