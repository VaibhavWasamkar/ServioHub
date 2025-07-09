import { useContext, useState } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [role, setRole] = useState("customer");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password || !role)
      return alert("Please fill in all fields and select a role");

    try {
      const res = await axios.post("https://serviohub.onrender.com/api/auth/login", {
        ...formData,
        role,
      });

      const { user, token } = res.data;
      login(user, token);

      if (user.role === "technician") {
        navigate("/dashboard/technician");
      } else if (user.role === "customer") {
        navigate("/dashboard/customer");
      } else {
        alert("Unknown role. Please contact support.");
      }
    } catch (err) {
      const message = err.response?.data?.error || "Server error";
      alert(message);
    }
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setFormData({ email: "", password: "" });
  };

  const inputStyle = {
    width: "100%",
    padding: "0.5rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    boxSizing: "border-box"
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
    fontSize: "0.8rem"
  };

  const containerStyle = {
    backgroundColor: "#fff",
    maxWidth: "400px",
    margin: "3rem auto",
    padding: "2rem",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center"
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: "2rem", color: "#007bff" }}>User Login</h2>

      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "1.5rem" }}>
        <button
          onClick={() => handleRoleSelect("customer")}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: role === "customer" ? "#007bff" : "#e9ecef",
            color: role === "customer" ? "#fff" : "#000",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Customer
        </button>
        <button
          onClick={() => handleRoleSelect("technician")}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: role === "technician" ? "#007bff" : "#e9ecef",
            color: role === "technician" ? "#fff" : "#000",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Technician
        </button>
      </div>

      {role && (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={formData.email}
            required
            style={inputStyle}
          />

          <div style={{ position: "relative" }}>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={handleChange}
              value={formData.password}
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

          <button
            type="submit"
            style={{
              padding: "0.5rem",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Login
          </button>

          <p style={{ marginTop: "1rem" }}>
            {role === "customer" ? (
              <>
                New Customer?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/register/customer")}
                  style={{ background: "none", border: "none", color: "#007bff", cursor: "pointer" }}
                >
                  Register Now
                </button>
              </>
            ) : (
              <>
                New Technician?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/register/technician")}
                  style={{ background: "none", border: "none", color: "#007bff", cursor: "pointer" }}
                >
                  Apply Now
                </button>
              </>
            )}
          </p>
        </form>
      )}
    </div>
  );
}
