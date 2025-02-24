College Event Planning Web App

This is a MERN stack web application that automates event planning for college fests. It includes features for event scheduling, team assignments, budget tracking, task management, and an AI-powered assistant to assign volunteers to tasks based on their skills.

🚀 Features

Event Management: Create, update, and view events.

Volunteer Management: Register and assign volunteers based on skills.

AI-Powered Task Assignment: Automatically assigns volunteers to event tasks.

Real-time API Communication using Express and MongoDB.

User-friendly Interface with React and Tailwind CSS.

🛠️ Tech Stack

Frontend: React, Tailwind CSS

Backend: Node.js, Express

Database: MongoDB

AI Service: EdenAI API (for volunteer-task matching)

📂 Folder Structure

📦 project-root
├── 📂 backend (Express API)
│   ├── 📂 routes (Event & Volunteer APIs)
│   ├── 📂 models (Mongoose Schemas)
│   ├── server.js (Main server file)
├── 📂 frontend (React App)
│   ├── 📂 src
│   │   ├── 📂 components
│   │   ├── 📂 pages
│   │   ├── App.js
├── .env (Environment Variables)
├── README.md (Documentation)

🚀 Setup Instructions

1️⃣ Clone the Repository

git clone https://github.com/karma2912/event_manager_team_F.git
cd mithibai_hackathon for frontend
cd backend for backend

2️⃣ Backend Setup

cd backend
npm install

Create a .env file in the backend folder:

MONGO_URI=your_mongodb_connection_string
PORT=5000
EDENAI_API_KEY=your_api_key

Start the backend server:

npm start

3️⃣ Frontend Setup

cd ../frontend
npm install
npm start

The frontend will be running at http://localhost:5000.

📌 API Endpoints

Event Routes

GET /api/getevents → Fetch all events

POST /api/events → Create an event

Volunteer Routes

GET /api/getvolunteers → Fetch all volunteers

POST /api/volunteers → Register a volunteer

AI-Powered Assignment

GET /api/assignVolunteers → AI assigns volunteers to tasks

🤖 AI Volunteer Assignment Logic

Fetches all event tasks and volunteer skills.

Uses EdenAI API to analyze and assign the best volunteers.

Returns assignments in JSON format:

{
  "logistics": "John Doe",
  "catering": "Jane Smith"
}

📌 Main Fundamentals

Authentication & Role-based Access Control (RBAC)

Real-time updates of assignments

User Dashboard with task assignment tracking

🤝 Contributing

Fork the repo & clone it.

Create a feature branch (git checkout -b feature-name).

Commit changes (git commit -m 'Added feature').

Push to the branch (git push origin feature-name).

Create a Pull Request.

📄 License

This project is open-source under the MIT License.
