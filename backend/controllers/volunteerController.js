const Volunteer = require("../models/Volunteer");

// Register Volunteer
exports.createVolunteer = async (req, res) => {
  try {
    const { name, skills, availability } = req.body;
    const volunteer = new Volunteer({ name, skills, availability });
    await volunteer.save();
    res.status(201).json(volunteer);
  } catch (error) {
    res.status(500).json({ error: "Failed to register volunteer" });
  }
};

// Get All Volunteers
exports.getVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find();
    res.status(200).json(volunteers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch volunteers" });
  }
};
