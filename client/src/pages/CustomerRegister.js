import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CustomerRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword)
      return alert("All fields are required");

    if (password.length < 6)
      return alert("Password must be at least 6 characters");

    if (password !== confirmPassword)
      return alert("Passwords do not match");

    try {
      await axios.post("https://serviohub.onrender.com/api/auth/register", {
        name,
        email,
        password,
        role: "customer",
      });

      alert("Registered successfully! Please log in.");
      navigate("/login");
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || err.message));
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.5rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    boxSizing: "border-box",
  };

  const toggleBtnStyle = {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "#007bff",
    cursor: "pointer",
    fontSize: "0.8rem",
  };

  const containerStyle = {
    backgroundColor: "#fff",
    maxWidth: "400px",
    margin: "3rem auto",
    padding: "2rem",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ color: "#007bff", marginBottom: "1rem" }}>
        Customer Registration
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <input
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <div style={{ position: "relative" }}>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={toggleBtnStyle}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div style={{ position: "relative" }}>
          <input
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={toggleBtnStyle}
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button
          type="submit"
          style={{
            padding: "0.5rem",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Register
        </button>

        <p style={{ marginTop: "1rem" }}>
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            style={{
              background: "none",
              border: "none",
              color: "#007bff",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}
