import React, { useState, useEffect } from "react";

const Dashboard = () => {
  const [assignments, setAssignments] = useState(null);
  const [events, setEvents] = useState(null); // State for events
  const [volunteers, setVolunteers] = useState(null); // State for volunteers
  const [loading, setLoading] = useState(false); // Loading state
  const [showEvents, setShowEvents] = useState(false); // State to show/hide Events section
  const [showVolunteers, setShowVolunteers] = useState(false); // State to show/hide Volunteers section

  // Fetch AI Assignments from Backend
  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/assignVolunteers");
      const data = await response.json();
      console.log("Fetched Assignments:", data);
      if (data.assignments) {
        setAssignments(data.assignments);
      } else {
        console.error("Invalid data format:", data);
      }
    } catch (error) {
      console.error("Error fetching AI assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Events from Backend
  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/getevents");
      const data = await response.json();
      console.log("Fetched Events:", data);  // Log the response to debug
      if (data.events) {
        setEvents(data.events); // Set events state
      } else {
        console.error("Invalid events data:", data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };
  
  const fetchVolunteers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/getvolunteers");
      const data = await response.json();
      console.log("Fetched Volunteers:", data);  // Log the response to debug
      if (data.volunteers) {
        setVolunteers(data.volunteers); // Set volunteers state
      } else {
        console.error("Invalid volunteers data:", data);
      }
    } catch (error) {
      console.error("Error fetching volunteers:", error);
    }
  };
  
  useEffect(() => {
    fetchAssignments(); // Fetch assignments on component mount
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="bg-white shadow-md rounded-lg p-6 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800">🎉 Event Management Dashboard</h1>
        <p className="text-lg mt-2 text-gray-600">Manage events, volunteers & AI-powered task assignments efficiently.</p>
      </header>

      {/* Dashboard Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">

        {/* Events Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700">📅 Events</h2>
          <p className="text-gray-600 mt-2">View & manage your upcoming events.</p>
          <button 
            onClick={() => { 
              setShowEvents(!showEvents); 
              fetchEvents(); // Fetch events when clicked
            }} 
            className="bg-blue-500 text-white mt-4 px-4 py-2 rounded-lg w-full hover:bg-blue-600 transition"
          >
            {showEvents ? "Hide Events" : "View Events"}
          </button>

          {/* Display Events */}
          {showEvents && events && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-bold">Upcoming Events:</h3>
              <ul className="mt-2">
                {events.map((event) => (
                  <li key={event._id} className="text-sm text-gray-700 bg-gray-200 p-2 my-2 rounded-lg">
                    <strong>{event.eventName}</strong> - {event.eventDate}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Volunteers Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700">🤝 Volunteers</h2>
          <p className="text-gray-600 mt-2">Check available volunteers & their skills.</p>
          <button 
            onClick={() => { 
              setShowVolunteers(!showVolunteers);
              fetchVolunteers(); // Fetch volunteers when clicked
            }} 
            className="bg-green-500 text-white mt-4 px-4 py-2 rounded-lg w-full hover:bg-green-600 transition"
          >
            {showVolunteers ? "Hide Volunteers" : "View Volunteers"}
          </button>

          {/* Display Volunteers */}
          {showVolunteers && volunteers && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-bold">Volunteers List:</h3>
              <ul className="mt-2">
                {volunteers.map((volunteer) => (
                  <li key={volunteer._id} className="text-sm text-gray-700 bg-gray-200 p-2 my-2 rounded-lg">
                    <strong>{volunteer.name}</strong> - {volunteer.skills.join(", ")}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* AI Assignments Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700">🤖 AI Task Assignments</h2>
          <p className="text-gray-600 mt-2">Get AI-based volunteer-task matching.</p>

          {/* Refresh Assignments Button */}
          <button 
            onClick={fetchAssignments} 
            className="bg-purple-500 text-white p-2 rounded-lg mt-4 w-full hover:bg-purple-600 transition"
            disabled={loading} // Disable while loading
          >
            {loading ? "Loading..." : "Refresh AI Assignments"}
          </button>

          {/* Display AI Assignments */}
          {assignments ? (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-bold">Task Assignments:</h3>
              <ul className="mt-2">
                {Object.entries(assignments).map(([task, volunteer]) => (
                  <li key={task} className="text-sm text-gray-700 bg-gray-200 p-2 my-2 rounded-lg">
                    <strong>{task}</strong>: {volunteer || "No volunteer assigned"}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-500 mt-4">No assignments yet...</p>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;
