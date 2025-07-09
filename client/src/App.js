import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import CustomerRegister from "./pages/CustomerRegister";
import TechnicianRegister from "./pages/TechnicianRegister";
import CustomerDashboard from "./pages/CustomerDashboard";
import TechnicianDashboard from "./pages/TechnicianDashboard";

const App = () => {
  return (
    <BrowserRouter>
      <style>{`
        body {
          margin: 0;
          padding: 0;
          background-image: url('/Background.jpg');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }
      `}</style>

      <div style={overlayStyle}>
        <Navbar />
        <main style={mainContent}>
          <Routes>
            <Route
              path="/"
              element={
                <div style={homeStyle}>
                  <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                    Welcome to <span style={{ color: "#007bff" }}>ServioHub</span>
                  </h1>
                  <p>Your trusted hub for local service jobs</p>
                </div>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register/customer" element={<CustomerRegister />} />
            <Route path="/register/technician" element={<TechnicianRegister />} />
            <Route path="/dashboard/customer" element={<CustomerDashboard />} />
            <Route path="/dashboard/technician" element={<TechnicianDashboard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

const overlayStyle = {
  fontFamily: "Arial, sans-serif",
  minHeight: "100vh",
  backgroundColor: "rgba(255, 255, 255, 0.8)"
};

const mainContent = {
  padding: "2rem",
  maxWidth: "1000px",
  margin: "auto"
};

const homeStyle = {
  textAlign: "center",
  padding: "4rem 1rem"
};

export default App;
