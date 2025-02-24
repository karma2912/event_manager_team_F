import React, { useState } from "react";

const VolunteerForm = () => {
  const [name, setName] = useState("");
  const [skills, setSkills] = useState("");
  const [availability, setAvailability] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const volunteerData = { name, skills: skills.split(","), availability };

    try {
      const response = await fetch("http://localhost:5000/api/volunteers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(volunteerData),
      });

      if (response.ok) {
        setShowModal(true);
        setName("");
        setSkills("");
        setAvailability("");
      } else {
        console.error("Failed to register volunteer");
      }
    } catch (error) {
      console.error("Error registering volunteer:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-center mb-4">
        Register as a Volunteer
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border rounded-lg shadow-sm"
          required
        />
        <input
          type="text"
          placeholder="Skills (comma separated, e.g., Design, Management)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="w-full p-3 border rounded-lg shadow-sm"
          required
        />
        <input
          type="text"
          placeholder="Availability (e.g., Weekends, Evenings)"
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          className="w-full p-3 border rounded-lg shadow-sm"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white p-3 rounded-lg w-full hover:bg-green-700 transition"
        >
          Register
        </button>
      </form>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-bold mb-4">Registration Successful!</h3>
            <p>You have been registered as a volunteer.</p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerForm;
