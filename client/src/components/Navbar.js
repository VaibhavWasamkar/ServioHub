import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.5rem 2rem",
        backgroundColor: "#f8f9fa",
        borderBottom: "1px solid #ddd",
        position: "sticky",
        top: 0,
        zIndex: 1000
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "bold", fontSize: "1.5rem" }}>
        <Link to="/" style={{ textDecoration: "none", color: "#333" }}>
          ServioHub
        </Link>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {!user ? (
          <Link to="/login" style={linkStyle}>
            Login
          </Link>
        ) : (
          <>
            {user.role === "customer" && (
              <Link to="/dashboard/customer" style={linkStyle}>
                Dashboard
              </Link>
            )}
            {user.role === "technician" && (
              <Link to="/dashboard/technician" style={linkStyle}>
                Dashboard
              </Link>
            )}
            <button onClick={handleLogout} style={logoutBtnStyle}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

const linkStyle = {
  textDecoration: "none",
  color: "#007bff",
  fontWeight: "550"
};

const logoutBtnStyle = {
  padding: "0.4rem 0.8rem",
  backgroundColor: "#dc3545",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "500"
};

export default Navbar;
