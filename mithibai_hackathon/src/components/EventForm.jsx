import React, { useState } from "react";

const EventForm = () => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [budget, setBudget] = useState("");
  const [tasks, setTasks] = useState([""]);
  const [showModal, setShowModal] = useState(false); // Success Modal State
  const [aiResponse, setAiResponse] = useState(""); // AI Response
  const [question, setQuestion] = useState(""); // AI User Input

  const handleTaskChange = (index, value) => {
    const newTasks = [...tasks];
    newTasks[index] = value;
    setTasks(newTasks);
  };

  const addTask = () => {
    setTasks([...tasks, ""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eventData = { eventName, eventDate, budget, tasks };

    try {
      const response = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        setShowModal(true); // Show Success Modal
        setEventName("");
        setEventDate("");
        setBudget("");
        setTasks([""]);
      }
    } catch (error) {
      console.error("Error submitting event:", error);
    }
  };

  // AI Assistant Call
  const askAI = async () => {
    try {
      const response = await fetch("http://localhost:5000/aiAssistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });
      const data = await response.json();
      setAiResponse(data.reply);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Create an Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Event Name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        />
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        />
        <input
          type="number"
          placeholder="Budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        />
        <div>
          <label className="block mb-2">List of Tasks</label>
          {tasks.map((task, index) => (
            <input
              key={index}
              type="text"
              placeholder="Task"
              value={task}
              onChange={(e) => handleTaskChange(index, e.target.value)}
              className="w-full p-2 border rounded-lg mb-2"
              required
            />
          ))}
          <button
            type="button"
            onClick={addTask}
            className="bg-gray-900 text-white p-2 rounded-lg mt-2 w-full"
          >
            Add Task
          </button>
        </div>
        <button type="submit" className="bg-black text-white p-2 rounded-lg w-full">
          Create Event
        </button>
      </form>

      {/* AI Assistant Section */}
      <div className="mt-6">
        <h3 className="text-xl font-bold">Generate Schedule</h3>
        <input
          type="text"
          placeholder="Ask anything about event planning..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-2 border rounded-lg mt-2"
        />
        <button onClick={askAI} className="bg-black text-white p-2 rounded-lg mt-2 w-full">
          Generate
        </button>
        {aiResponse && <p className="mt-4 bg-gray-200 p-2 rounded-lg">{aiResponse}</p>}
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-bold text-black">Event Created Successfully!</h3>
            <p className="mt-2 text-gray-600">Your event has been saved successfully.</p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-black text-white p-2 rounded-lg w-full"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventForm;
