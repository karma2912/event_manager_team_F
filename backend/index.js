const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./db");
const eventRoutes = require("./routes/eventRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");
const errorHandler = require("./middleware/errorHandler");
const mongoose = require("mongoose");
const Event = require("./models/Event");
const Volunteer = require("./models/Volunteer");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/events", eventRoutes);
app.use("/api/volunteers", volunteerRoutes);

app.use(errorHandler);

// Get Events
app.get("/api/getevents", async (req, res) => {
  try {
    const events = await Event.find(); // Fetch all events from DB
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// Get Volunteers
app.get("/api/getvolunteers", async (req, res) => {
  try {
    const volunteers = await Volunteer.find(); // Fetch all volunteers from DB
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch volunteers" });
  }
});

// Create Event with Event Type
app.post("/api/events", async (req, res) => {
  try {
    const { eventName, eventType, eventDate, budget, tasks } = req.body;
    const newEvent = new Event({ eventName, eventType, eventDate, budget, tasks });
    await newEvent.save();
    res.status(201).json({ message: "Event saved successfully!" });
  } catch (error) {
    console.error("Error saving event:", error);
    res.status(500).json({ error: "Failed to save event" });
  }
});

// Create Volunteer
app.post("/api/volunteers", async (req, res) => {
  try {
    const { name, skills, availability } = req.body;
    const newVolunteer = new Volunteer({ name, skills, availability });
    await newVolunteer.save();
    res.status(201).json({ message: "Volunteer registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to register volunteer" });
  }
});

// Assign Volunteers to Tasks
app.get("/api/assignVolunteers", async (req, res) => {
  try {
    const event = await Event.findOne();
    const volunteers = await Volunteer.find();

    if (!event || !volunteers.length) {
      return res.status(400).json({ error: "No event or volunteers found" });
    }

    const tasks = Array.isArray(event.tasks) ? event.tasks.join(", ") : "";
    const volunteersList = volunteers.map((v) =>` ${v.name}: ${v.skills.join(", ")}`).join("\n");

    const aiPrompt = `
      Given the following tasks for an event:
      ${tasks}

      And these available volunteers with their skills:
      ${volunteersList}

      Assign the best volunteer for each task based on their skills and availability.
      Return output in JSON format like:
      {
        "logistics": "Volunteer Name",
        "catering": "Volunteer Name",
        "security": "Volunteer Name"
      }
    `;

    const url = "https://api.edenai.run/v2/multimodal/chat";
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization:`Bearer ${process.env.EDENAI_API_KEY}`,
      },
      body: JSON.stringify({
        response_as_dict: true,
        attributes_as_list: false,
        show_base_64: true,
        show_original_response: false,
        temperature: 0,
        max_tokens: 1000,
        providers: "openai",
        messages:[
          {
            role: "user",
            content:[
              {
                type: "text",
                content: { text: aiPrompt },
              },
          ]
          },
        ],
      }),
    };

    const response = await fetch(url, options);
    const data = await response.json();
    const generatedText = data.openai.generated_text;
    const jsonResponse = extractAssignmentsFromResponse(generatedText);

    res.json({ assignments: jsonResponse });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "AI response failed" });
  }
});

// Extract JSON assignments from AI response
function extractAssignmentsFromResponse(text) {
  try {
    const jsonText = text.match(/\{[\s\S]*\}/)?.[0];
    if (!jsonText) throw new Error("No JSON found in AI response");

    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error parsing AI response:", error.message);
    return {};
  }
}

// AI Assistant
app.post("/aiAssistant", async (req, res) => {
  try {
    const { message } = req.body;

    const url = "https://api.edenai.run/v2/multimodal/chat";
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization:` Bearer ${process.env.EDENAI_API_KEY}`,
      },
      body: JSON.stringify({
        response_as_dict: true,
        attributes_as_list: false,
        show_base_64: true,
        show_original_response: false,
        temperature: 0,
        max_tokens: 1000,
        providers: "openai",
        messages:[
          {
            role: "user",
            content:[
              {
                type: "text",
                content: { text: message },
              },
          ]
          },
        ],
      }),
    };

    const response = await fetch(url, options);
    const data = await response.json();
    res.json({ reply: data.openai.generated_text });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "AI response failed" });
  }
});

// Generate Schedule with Timings
app.get("/generateSchedule", async (req, res) => {
  try {
    const events = await Event.find();
    if (!events.length) {
      return res.status(400).json({ error: "No events found" });
    }

    const schedule = {};
    let startTime = new Date(); // Current time as the start time

    events.forEach((event, index) => {
      const duration = 2 * 60 * 60 * 1000; // 2 hours per event
      const endTime = new Date(startTime.getTime() + duration);

      schedule[event.eventType] = {
        eventName: event.eventName,
        startTime: startTime.toLocaleTimeString(),
        endTime: endTime.toLocaleTimeString(),
      };

      startTime = new Date(endTime.getTime() + 30 * 60 * 1000); // 30-min break
    });

    res.json({ schedule });
  } catch (error) {
    console.error("Error generating schedule:", error);
    res.status(500).json({ error: "Failed to generate schedule" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));