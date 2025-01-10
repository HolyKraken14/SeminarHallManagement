const mongoose = require("mongoose");
    
const seminarHallSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  equipment: { type: [String], required: true },
  capacity: { type: Number, required: true },
  details: { type: String, required: true },
});

module.exports = mongoose.model("SeminarHall", seminarHallSchema);
