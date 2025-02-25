import React, { useState, useEffect } from "react";

const ScheduleGenerator = () => {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch the generated schedule from the backend API
  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/generateSchedule");
      const data = await response.json();
      
      if (data.schedule) {
        setSchedule(data.schedule); // Set schedule state with the fetched data
      } else {
        console.error("Failed to fetch schedule: ", data);
      }
    } catch (error) {
      console.error("Error fetching schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule(); // Fetch the schedule on component mount
  }, []);

  return (
    <div>
      {/* Loading state */}
      {loading ? (
        <p className="text-center text-lg text-gray-600">Loading Schedule...</p>
      ) : (
        <div>
          {schedule ? (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-bold">Event Schedule:</h3>
              <ul className="mt-2">
                {Object.entries(schedule).map(([eventType, event]) => (
                  <li key={eventType} className="text-sm text-gray-700 bg-gray-200 p-2 my-2 rounded-lg">
                    <strong>{event.eventName}</strong> <br />
                    <span className="text-gray-600">Start: {event.startTime}</span> <br />
                    <span className="text-gray-600">End: {event.endTime}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-500 mt-4">No schedule available...</p>
          )}
        </div>
      )}

      {/* Button to refresh the schedule */}
      <button
        onClick={fetchSchedule}
        className="bg-purple-500 text-white p-2 rounded-lg mt-4 w-full hover:bg-purple-600 transition"
        disabled={loading}
      >
        {loading ? "Refreshing..." : "Refresh Schedule"}
      </button>
    </div>
  );
};

export default ScheduleGenerator;
