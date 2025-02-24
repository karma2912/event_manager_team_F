const express = require("express");
const { createVolunteer, getVolunteers } = require("../controllers/volunteerController");

const router = express.Router();

router.post("/", createVolunteer); // Register volunteer
router.get("/", getVolunteers); // Get all volunteers

module.exports = router;
