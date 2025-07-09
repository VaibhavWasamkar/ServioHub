# 🛠 ServioHub: Your Trusted Hub for Local Service Jobs

**ServioHub** is a full-stack service platform that connects local customers with skilled technicians across 25 categories — like electricians, plumbers, AC repair, and more. Built using **React**, **Node.js**, **Express**, and **MongoDB**, it supports authentication, job posting, technician assignment, feedback, and address management.

---

## Features

### User Roles
- **Customer**
  - Register/Login
  - Post Jobs with Pincode & City Detection
  - Select Saved or New Address
  - View Suggested Technicians by Rating
  - Mark Job as Done with ⭐ Rating & Review

- **Technician**
  - Register/Login with Expertise & Pincode
  - Get Auto-Suggested Jobs by City & Skill
  - Accept or Leave Jobs
  - View Job History (Completed Jobs)

---

## Tech Stack

### Frontend
- React.js
- React Router
- Axios
- Custom Context API (Auth)

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- JWT Auth
- CORS, dotenv, bcrypt, express-rate-limit

### Tools
- Render (free-tier hosting)
- GitHub (source control)

---

## Folder Structure

```bash
ServioHub/
├── client/ # React frontend
│ ├── public/ # Public assets (favicon, logo, background)
│ ├── src/
│ │ ├── components/ # Navbar and reusable UI components
│ │ ├── context/ # React Context (Auth)
│ │ ├── pages/ # Login, Dashboard, Register pages
│ │ ├── App.js # App entry
│ │ └── index.js # React root
│ ├── package.json # Client dependencies and scripts
│ └── build/ # Production build (after npm run build)
│
├── server/ # Node + Express backend
│ ├── config/ # Database configuration
│ ├── controllers/ # Route handlers
│ ├── middleware/ # Auth middleware
│ ├── models/ # Mongoose models (Customer, Job, Technician)
│ ├── routes/ # API route definitions
│ ├── utils/ # Utility functions (e.g., pincode-city mapping)
│ ├── .env # Environment variables
│ ├── index.js # Express app entry point
│ └── package.json # Server dependencies and scripts
│
└── README.md # Project documentation
```

---

## Local Setup (Development)

### 1. Clone the Repo
git clone https://github.com/VaibhavWasamkar/ServioHub.git
cd ServioHub

### 2. Setup Backend
cd server
npm install
touch .env

Add the following in .env:
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
PORT=5000

Start Backend:
npm start

### 3. Setup Frontend
cd ../client
npm install
npm start

Open: http://localhost:3000
