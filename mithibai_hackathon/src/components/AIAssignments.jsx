import React, { useState } from "react";

const AIAssignments = () => {
  const [assignments, setAssignments] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGetAssignments = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/assignVolunteers");
      if (!response.ok) {
        throw new Error("Failed to fetch assignments");
      }

      const data = await response.json();
      setAssignments(data.assignments);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      {/* Fetch AI Assignments */}
      <button
        onClick={handleGetAssignments}
        className="bg-blue-500 text-white p-2 rounded-lg w-full hover:bg-blue-600 transition"
      >
        {loading ? "Fetching Assignments..." : "Get AI Assignments"}
      </button>

      {/* Display AI Assignments */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {assignments && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-bold mb-2">AI Task Assignments:</h3>
          <ul className="list-disc list-inside">
            {Object.entries(assignments).map(([task, volunteers]) => (
              <li key={task} className="text-sm">
                <span className="font-medium">{task}:</span> 
                <strong> {Array.isArray(volunteers) ? volunteers.join(", ") : volunteers}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AIAssignments;
