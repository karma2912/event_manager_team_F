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


app.get("/api/getevents", async (req, res) => {
    try {
      const events = await Event.find(); // Fetch all events from DB
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });
  
  app.get("/api/getvolunteers", async (req, res) => {
    try {
      const volunteers = await Volunteer.find(); // Fetch all volunteers from DB
      res.json(volunteers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch volunteers" });
    }
  });


app.post("/api/events", async (req, res) => {
  try {
    const { eventName, eventDate, budget, tasks } = req.body;
    const newEvent = new Event({ eventName, eventDate, budget, tasks });
    await newEvent.save();
    res.status(201).json({ message: "Event saved successfully!" });
  } catch (error) {
    console.error("Error saving event:", error);
    res.status(500).json({ error: "Failed to save event" });
  }
});

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

app.get("/api/assignVolunteers", async (req, res) => {
    try {
      const event = await Event.findOne(); // Fetch the event
      const volunteers = await Volunteer.find(); // Fetch all volunteers
  
      if (!event || !volunteers.length) {
        return res.status(400).json({ error: "No event or volunteers found" });
      }
  
      // Ensure tasks is an array and join them into a string
      const tasks = Array.isArray(event.tasks) ? event.tasks.join(", ") : "";
      // Ensure volunteers are formatted properly
      const volunteersList = Array.isArray(volunteers)
        ? volunteers.map((v) => `${v.name}: ${v.skills.join(", ")}`).join("\n")
        : "";
  
      const aiPrompt = `
        Given the following tasks for an event:
        ${tasks}
  
        And these available volunteers with their skills:
        ${volunteersList}
  
        Assign the best volunteer for each task based on their skills and availability.
        Return output in JSON format like :
        {
          "logistics": "Volunteer Name",
          "catering": "Volunteer Name",
          "security": "Volunteer Name"
        }
      `;
  
      // API request to AI service (EdenAI)
      const url = "https://api.edenai.run/v2/multimodal/chat";
      const options = {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authorization: `Bearer ${process.env.EDENAI_API_KEY}`, // Store key in .env
        },
        body: JSON.stringify({
          response_as_dict: true,
          attributes_as_list: false,
          show_base_64: true,
          show_original_response: false,
          temperature: 0,
          max_tokens: 1000,
          providers: "openai",
          messages: [
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
     console.log(data)
      // Assuming the AI response comes as text, process it
      const generatedText = data.openai.generated_text;

      console.log(generatedText)
  
      // Clean and extract only task and volunteer assignments
      const jsonResponse = extractAssignmentsFromResponse(generatedText); // Parse to get assignments
  
      console.log(jsonResponse); // Verify the assignments format
  
      // Send the cleaned assignment data to the frontend
      res.json({ assignments: jsonResponse });
  
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "AI response failed" });
    }
  });
  
  // Clean the response to filter out unnecessary information
  function extractAssignmentsFromResponse(text) {
    try {
        // Remove unwanted characters (sometimes AI adds extra text)
        const jsonText = text.match(/\{[\s\S]*\}/)?.[0]; // Extract JSON block
        if (!jsonText) throw new Error("No JSON found in AI response");

        const assignments = JSON.parse(jsonText);
        console.log(assignments); // Debugging: Check if parsing worked
        return assignments;
    } catch (error) {
        console.error("Error parsing AI response:", error.message);
        return {};
    }
}

  

  app.post("/aiAssistant", async (req, res) => {
    try {
      const { message } = req.body; // User's question from frontend
  
      const url = "https://api.edenai.run/v2/multimodal/chat";
      const options = {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authorization: `Bearer ${process.env.EDENAI_API_KEY}`, // Store key in .env
        },
        body: JSON.stringify({
          response_as_dict: true,
          attributes_as_list: false,
          show_base_64: true,
          show_original_response: false,
          temperature: 0,
          max_tokens: 1000,
          providers: "openai",
          messages: [{ role: "user", content: [{ type: "text", content: message }] }],
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


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
