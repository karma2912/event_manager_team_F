const Event = require("../models/Event");

// Create Event
exports.createEvent = async (req, res) => {
  try {
    const { eventName, eventDate, budget, tasks } = req.body;
    const event = new Event({ eventName, eventDate, budget, tasks });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: "Failed to create event" });
  }
};

// Get All Events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
};
