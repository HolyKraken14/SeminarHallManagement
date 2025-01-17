const mongoose = require("mongoose");
const SeminarHall = require("../models/seminarHallModel");

const seminarHalls = [
  {
    name: "Seminar Hall A",
    capacity: 100,
    details: "Located on the first floor, suitable for workshops.",
    images: [
      "https://c8.alamy.com/comp/HREHTX/microphone-with-blurred-photo-of-empty-conference-hall-or-seminar-HREHTX.jpg",
      "https://media.istockphoto.com/id/120759015/photo/interior-of-a-conference-hall.jpg?s=612x612&w=0&k=20&c=XI9EgF16qBl8oBdgVvcYUBr0nPD9OkFLCLrIAlQ-92A=",
    ],
    equipment: [
      { name: "Projector", type: "AV", condition: "Good", available: true, quantity: 1 },
      { name: "Sound System", type: "AV", condition: "Excellent", available: true, quantity: 2 },
      { name: "Whiteboard", type: "Stationary", condition: "Good", available: true, quantity: 3 },
      { name: "AC", type: "HVAC", condition: "Good", available: true, quantity: 2 },
      { name: "Microphone", type: "AV", condition: "Good", available: true, quantity: 5 },
      { name: "WiFi", type: "Network", condition: "Excellent", available: true, quantity: 1 },
    ],
  },
  {
    name: "Seminar Hall B",
    capacity: 150,
    details: "Located on the ground floor, ideal for conferences.",
    images: [
      "https://example.com/images/hallB1.jpg",
      "https://example.com/images/hallB2.jpg",
    ],
    equipment: [
      { name: "Projector", type: "AV", condition: "Good", available: true, quantity: 1 },
      { name: "Sound System", type: "AV", condition: "Good", available: true, quantity: 3 },
      { name: "Whiteboard", type: "Stationary", condition: "Excellent", available: true, quantity: 2 },
      { name: "WiFi", type: "Network", condition: "Good", available: true, quantity: 1 },
      { name: "AC", type: "HVAC", condition: "Good", available: false, quantity: 1 },
    ],
  },
  {
    name: "Seminar Hall C",
    capacity: 120,
    details: "Located on the second floor, perfect for lectures.",
    images: [
      "https://example.com/images/hallC1.jpg",
      "https://example.com/images/hallC2.jpg",
    ],
    equipment: [
      { name: "Microphone", type: "AV", condition: "Good", available: true, quantity: 6 },
      { name: "AC", type: "HVAC", condition: "Good", available: true, quantity: 4 },
      { name: "Projector", type: "AV", condition: "Excellent", available: true, quantity: 2 },
      { name: "Sound System", type: "AV", condition: "Good", available: true, quantity: 1 },
      { name: "WiFi", type: "Network", condition: "Excellent", available: true, quantity: 1 },
    ],
  },
  {
    name: "Seminar Hall D",
    capacity: 200,
    details: "Located near the auditorium, great for large meetings.",
    images: [
      "https://example.com/images/hallD1.jpg",
      "https://example.com/images/hallD2.jpg",
    ],
    equipment: [
      { name: "Speaker System", type: "AV", condition: "Excellent", available: true, quantity: 3 },
      { name: "Projector", type: "AV", condition: "Good", available: false, quantity: 1 },
      { name: "AC", type: "HVAC", condition: "Good", available: true, quantity: 2 },
      { name: "WiFi", type: "Network", condition: "Good", available: false, quantity: 1 },
    ],
  },
  {
    name: "Seminar Hall E",
    capacity: 80,
    details: "Compact and cozy for small group discussions.",
    images: [
      "https://example.com/images/hallE1.jpg",
      "https://example.com/images/hallE2.jpg",
    ],
    equipment: [
      { name: "Whiteboard", type: "Stationary", condition: "Good", available: false, quantity: 1 },
      { name: "Sound System", type: "AV", condition: "Excellent", available: true, quantity: 2 },
      { name: "Projector", type: "AV", condition: "Good", available: true, quantity: 1 },
      { name: "AC", type: "HVAC", condition: "Good", available: true, quantity: 1 },
    ],
  },
  {
    name: "Seminar Hall F",
    capacity: 300,
    details: "Spacious hall with advanced AV facilities.",
    images: [
      "https://example.com/images/hallF1.jpg",
      "https://example.com/images/hallF2.jpg",
    ],
    equipment: [
      { name: "Projector", type: "AV", condition: "Excellent", available: true, quantity: 2 },
      { name: "WiFi", type: "Network", condition: "Good", available: true, quantity: 1 },
      { name: "Sound System", type: "AV", condition: "Good", available: true, quantity: 5 },
      { name: "AC", type: "HVAC", condition: "Good", available: true, quantity: 2 },
    ],
  },
  {
    name: "Seminar Hall G",
    capacity: 90,
    details: "Suitable for seminars and presentations.",
    images: [
      "https://c8.alamy.com/comp/HREHTX/microphone-with-blurred-photo-of-empty-conference-hall-or-seminar-HREHTX.jpg",
      "https://example.com/images/hallG2.jpg",
    ],
    equipment: [
      { name: "Projector", type: "AV", condition: "Good", available: true, quantity: 1 },
      { name: "Microphone", type: "AV", condition: "Excellent", available: true, quantity: 3 },
      { name: "Sound System", type: "AV", condition: "Good", available: false, quantity: 2 },
    ],
  },
  {
    name: "Seminar Hall H",
    capacity: 250,
    details: "Large hall with great acoustic facilities.",
    images: [
      "https://example.com/images/hallH1.jpg",
      "https://example.com/images/hallH2.jpg",
    ],
    equipment: [
      { name: "Speaker System", type: "AV", condition: "Good", available: true, quantity: 2 },
      { name: "Projector", type: "AV", condition: "Good", available: true, quantity: 1 },
      { name: "AC", type: "HVAC", condition: "Good", available: false, quantity: 1 },
    ],
  },
  {
    name: "Seminar Hall I",
    capacity: 170,
    details: "Bright and airy hall, great for interactive sessions.",
    images: [
      "https://example.com/images/hallI1.jpg",
      "https://example.com/images/hallI2.jpg",
    ],
    equipment: [
      { name: "Projector", type: "AV", condition: "Good", available: true, quantity: 1 },
      { name: "Whiteboard", type: "Stationary", condition: "Good", available: true, quantity: 3 },
      { name: "Microphone", type: "AV", condition: "Excellent", available: true, quantity: 4 },
    ],
  },
  {
    name: "Seminar Hall J",
    capacity: 130,
    details: "Well-equipped with modern AV facilities.",
    images: [
      "https://example.com/images/hallJ1.jpg",
      "https://example.com/images/hallJ2.jpg",
    ],
    equipment: [
      { name: "Projector", type: "AV", condition: "Good", available: true, quantity: 2 },
      { name: "WiFi", type: "Network", condition: "Excellent", available: true, quantity: 1 },
      { name: "Sound System", type: "AV", condition: "Good", available: false, quantity: 3 },
    ],
  },
];

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    console.log("Clearing existing data...");
    await SeminarHall.deleteMany();
    console.log("Existing data cleared");

    console.log("Seeding seminar halls...");
    for (const [index, hall] of seminarHalls.entries()) {
      const displayId = index + 1;

      const newSeminarHall = new SeminarHall({
        name: hall.name,
        displayId,
        capacity: hall.capacity,
        details: hall.details,
        images: hall.images || [],
        equipment: hall.equipment,
      });

      console.log("Saving seminar hall:", hall.name);
      await newSeminarHall.save();
      console.log(`Seminar hall "${hall.name}" seeded successfully.`);
    }

    console.log("Seeding completed successfully!");
  } catch (err) {
    console.error("Error during seeding:", err);
  } 
};

module.exports = seedDatabase;
