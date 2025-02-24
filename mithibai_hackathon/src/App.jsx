import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import EventForm from "./components/EventForm";
import VolunteerForm from "./components/VolunteerForm";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import "./index.css";
import BudgetTracker from "./components/BudgetTracker";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/event-form" element={<EventForm />} />
          <Route path="/volunteer-form" element={<VolunteerForm />} />
          <Route path="/budget-tracker" element={<BudgetTracker />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;