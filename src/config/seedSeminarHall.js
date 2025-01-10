const mongoose = require("mongoose");
require("dotenv").config();

const SeminarHall = require("../models/seminarHallModel");

const seminarHalls = [
  {
    name: "Seminar Hall A",
    image: "https://example.com/image-a.jpg",
    equipment: ["Projector", "Sound System", "AC"],
    capacity: 100,
    details: "Located on the first floor, suitable for workshops.",
  },
  {
    name: "Seminar Hall B",
    image: "https://example.com/image-b.jpg",
    equipment: ["Whiteboard", "Microphone", "WiFi"],
    capacity: 150,
    details: "Located on the ground floor, ideal for conferences.",
  },
  // Add 8 more seminar halls here...
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await SeminarHall.deleteMany(); // Clear existing data
    await SeminarHall.insertMany(seminarHalls); 
    console.log("Database seeded successfully!");
   
  } catch (err) {
    console.error("Error seeding database:", err);
    mongoose.connection.close();
  }
};

module.exports=seedDatabase;
