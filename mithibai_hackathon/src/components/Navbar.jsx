import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gray-900 p-5 text-white flex justify-between items-center shadow-lg">
      <h1 className="text-2xl font-bold">Event Planner AI</h1>
      <ul className="flex space-x-6">
        <li><Link to="/" className="hover:text-gray-400">Dashboard</Link></li>
        <li><Link to="/event-form" className="hover:text-gray-400">Create Event</Link></li>
        <li><Link to="/volunteer-form" className="hover:text-gray-400">Register Volunteer</Link></li>
        <li><Link to="/budget-tracker" className="hover:text-gray-400">Budget Tracker</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;