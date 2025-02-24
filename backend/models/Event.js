const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  eventName: String,
  eventDate: String,
  budget: Number,
  tasks: [String], // Array to store multiple tasks
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
