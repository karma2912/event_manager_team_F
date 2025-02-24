const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema({
  name: String,
  skills: [String], // Array to store multiple skills
  availability: String, // Example: "Weekends", "Full-Time", etc.
});

const Volunteer = mongoose.model("Volunteer", volunteerSchema);

module.exports = Volunteer;
