import React, { useState, useEffect } from "react";

const BudgetTracker = () => {
  const [budget, setBudget] = useState(0);
  const [prediction, setPrediction] = useState("");

  useEffect(() => {
    fetch("/api/getBudgetPrediction")
      .then((res) => res.json())
      .then((data) => setPrediction(data.prediction));
  }, []);

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-center mb-4">Budget Tracker</h2>
      <p className="text-gray-600 text-center">
        Current Budget:{" "}
        <span className="text-blue-600 font-semibold"><i className="fa-solid fa-indian-rupee-sign m-2"></i>{budget}</span>
      </p>
      <p className="text-red-600 text-center font-bold mt-2">
        AI Predicted Cost: <i className="fa-solid fa-indian-rupee-sign m-2"></i>{prediction}
      </p>
    </div>
  );
};

export default BudgetTracker;
