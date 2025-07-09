import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function TechnicianRegister() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        expertise: "",
        experience: "",
        address: "",
        pincode:"",
        city: "",
        password: "",
        confirmPassword: "",
        role: "technician"
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "pincode" && value.length === 6) {
            try {
                const res = await axios.get(`https://api.postalpincode.in/pincode/${value}`);
                const city = res.data?.[0]?.PostOffice?.[0]?.Block || "";
                if (city) {
                    setFormData((prev) => ({ ...prev, city }));
                }
            } catch (err) {
                console.error("Failed to fetch city for pincode", err);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const {
            name,
            email,
            password,
            confirmPassword,
            phone,
            expertise,
            experience,
            address,
            pincode
        } = formData;

        // Basic field checks (excluding city for now)
        if (!name || !email || !password || !confirmPassword || !phone || !expertise || !experience || !address || !pincode)
            return alert("All fields are required");

        if (!/^\d{6}$/.test(pincode)) {
            return alert("Pincode must be exactly 6 digits.");
        }

        if (password.length < 6)
            return alert("Password must be at least 6 characters");

        if (password !== confirmPassword)
            return alert("Passwords do not match");

        try {
            // Fetch city from India Post API
            const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
            const postOffice = response.data?.[0]?.PostOffice;

            if (!postOffice || postOffice.length === 0) {
                return alert("Invalid pincode. Please enter a correct Indian pincode.");
            }

            const city = postOffice[0].Block || "";

            await axios.post("https://serviohub.onrender.com/api/auth/register", {
                ...formData,
                city
            });

            alert("Application submitted! Admin will review your request.");
            navigate("/login");
        } catch (err) {
            alert("Error: " + (err.response?.data?.error || err.message));
        }
    };

    const handlePhoneChange = (e) => {
        let value = e.target.value.replace(/\s+/g, ""); // Remove all spaces first

        // Ensure it starts with +91
        if (value.startsWith("+91") && value.length > 3) {
            value = "+91 " + value.slice(3);
        }

        setFormData({ ...formData, phone: value });
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
        maxWidth: "450px",
        margin: "3rem auto",
        padding: "2rem",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        textAlign: "center"
    };

    return (
        <div style={containerStyle}>
            <h2 style={{ color: "#007bff", marginBottom: "1rem" }}>
                Technician Application
            </h2>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <input name="name" placeholder="Full Name" onChange={handleChange} required style={inputStyle} />
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />
                <input
                    name="phone"
                    type="tel"
                    placeholder="Phone Number (e.g., +91 9876543210)"
                    onChange={handlePhoneChange}
                    value={formData.phone}
                    required
                    pattern="^\+91\s[6-9]\d{9}$"
                    title="Phone number must start with +91 followed by a space and a valid 10-digit Indian mobile number"
                    style={inputStyle}
                />
                <select
                    name="expertise"
                    onChange={handleChange}
                    value={formData.expertise}
                    required
                    style={inputStyle}
                >
                    <option value="">Select Your Expertise</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Plumber">Plumber</option>
                    <option value="AC Repair">AC Repair</option>
                    <option value="Carpenter">Carpenter</option>
                    <option value="Painter">Painter</option>
                    <option value="House Cleaning">House Cleaning</option>
                    <option value="Pest Control">Pest Control</option>
                    <option value="Appliance Repair">Appliance Repair</option>
                    <option value="Water Purifier Service">Water Purifier Service</option>
                    <option value="TV Installation">TV Installation</option>
                    <option value="CCTV Installation">CCTV Installation</option>
                    <option value="Washing Machine Repair">Washing Machine Repair</option>
                    <option value="Refrigerator Repair">Refrigerator Repair</option>
                    <option value="Geyser Repair">Geyser Repair</option>
                    <option value="Microwave Repair">Microwave Repair</option>
                    <option value="Mobile Repair">Mobile Repair</option>
                    <option value="Computer Repair">Computer Repair</option>
                    <option value="Gardening">Gardening</option>
                    <option value="Driver on Call">Driver on Call</option>
                    <option value="Home Shifting">Home Shifting</option>
                    <option value="Security Guard">Security Guard</option>
                    <option value="Masonry Work">Masonry Work</option>
                    <option value="Glass Work">Glass Work</option>
                    <option value="Roof Repair">Roof Repair</option>
                    <option value="Handyman">Handyman</option>
                </select>
                <input name="experience" placeholder="Years of Experience" onChange={handleChange} required style={inputStyle} />
                <input name="address" placeholder="Your Full Address" onChange={handleChange} required style={inputStyle} />
                <input name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} required style={inputStyle} />
                <input type="hidden" name="city" value={formData.city} />

                <div style={{ position: "relative" }}>
                    <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
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

                <p style={{ fontSize: "0.9rem", color: "#555" }}>
                    Note: Your application will be reviewed by the admin before approval.
                </p>

                <button
                    type="submit"
                    style={{
                        padding: "0.6rem",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        fontSize: "1rem",
                        cursor: "pointer"
                    }}
                >
                    Apply Now
                </button>

                <p style={{ marginTop: "1rem" }}>
                    Already registered?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#007bff",
                            cursor: "pointer"
                        }}
                    >
                        Login
                    </button>
                </p>
            </form>
        </div>
    );
}