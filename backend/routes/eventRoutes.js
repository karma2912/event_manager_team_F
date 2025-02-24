const express = require("express");
const { createEvent, getEvents } = require("../controllers/eventController");

const router = express.Router();

router.post("/", createEvent); // Create event
router.get("/", getEvents); // Get all events

module.exports = router;
