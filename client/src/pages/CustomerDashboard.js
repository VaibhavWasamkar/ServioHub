import { useCallback, useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
    const { user, token } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);
    const [recommendations, setRecommendations] = useState({});
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        address: "",
        pincode: "",
        city: ""
    });

    const navigate = useNavigate();

    const fetchJobs = useCallback(async () => {
        try {
            const res = await axios.get("https://serviohub.onrender.com/api/jobs", {
                headers: { Authorization: `Bearer ${token}` }
            });

            let filtered = res.data;

            if (user?.role === "customer") {
                filtered = filtered.filter(job => job.postedBy?._id?.toString() === user.id);
            }

            setJobs(filtered);

            const recommendationsObj = {};
            await Promise.all(filtered.map(async (job) => {
                if (job.status === "open") {
                    try {
                        const recRes = await axios.get(`https://serviohub.onrender.com/api/technicians/match?title=${job.title}&city=${job.city}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        recommendationsObj[job._id] = recRes.data;
                    } catch (err) {
                        console.error(`Failed to fetch recommendations for job ${job.title}`, err);
                    }
                }
            }));
            setRecommendations(recommendationsObj);

        } catch (err) {
            console.error("Failed to fetch jobs", err);
        }
    }, [token, user]);

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        fetchJobs();
    }, [token, navigate, fetchJobs]);

    const handleChange = async e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === "pincode" && value.length === 6) {
            try {
                const response = await axios.get(`https://api.postalpincode.in/pincode/${value}`);
                const block = response.data?.[0]?.PostOffice?.[0]?.Block || "";
                setFormData(prev => ({ ...prev, city: block }));
            } catch (err) {
                console.error("Failed to fetch city from pincode", err);
            }
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const { title, description, address, pincode } = formData;

        // Frontend validations first
        if (!title || !description || !address || !pincode)
            return alert("All fields are required");

        if (!/^\d{6}$/.test(pincode)) {
            return alert("Pincode must be exactly 6 digits.");
        }

        try {
            // Validate pincode again with API
            const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
            const postOffice = response.data?.[0]?.PostOffice;

            if (!postOffice || postOffice.length === 0) {
                return alert("Invalid pincode. Please enter a correct Indian pincode.");
            }

            // Extract district (city) from response
            const city = postOffice[0].Block || "";

            // Proceed with job post submission
            await axios.post("https://serviohub.onrender.com/api/jobs", {
                ...formData,
                city
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setFormData({ title: "", description: "", address: "", pincode: "", city: "" });
            await fetchJobs();
        } catch (err) {
            console.error("Failed to post job", err);
            alert("Error posting job");
        }
    };

    const [showRatingModal, setShowRatingModal] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");

    const handleChangeTechnician = async (jobId) => {
        try {
            await axios.patch(
                `https://serviohub.onrender.com/api/jobs/${jobId}`,
                { assignedTo: null, assignedToModel: null, status: "open" },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Technician removed. Job is open for reassignment.");
            fetchJobs();
        } catch (err) {
            alert("Failed to change technician.");
            console.error(err);
        }
    };

    return (
        <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Welcome, <span style={{ color: "brown" }}>{user?.name}</span></h2>

            {user?.role === "customer" && (
                <div
                    style={{
                        background: "#f9f9f9",
                        padding: "1.5rem",
                        borderRadius: "8px",
                        boxShadow: "0 0 5px rgba(0,0,0,0.1)",
                        marginBottom: "2rem"
                    }}
                >
                    <h3 style={{ marginBottom: "1rem" }}>Post a Job</h3>
                    <form
                        onSubmit={handleSubmit}
                        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
                    >
                        <select
                            name="title"
                            onChange={handleChange}
                            value={formData.title}
                            required
                            style={inputStyle}
                        >
                            <option value="">Select Job Title</option>
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
                        <input
                            name="description"
                            placeholder="Description"
                            onChange={handleChange}
                            value={formData.description}
                            required
                            style={inputStyle}
                        />
                        <input
                            name="address"
                            placeholder="Address"
                            onChange={handleChange}
                            value={formData.address}
                            required
                            style={inputStyle}
                        />
                        <input
                            name="pincode"
                            placeholder="Pincode"
                            onChange={handleChange}
                            value={formData.pincode}
                            required
                            style={inputStyle}
                        />
                        <input
                            type="hidden"
                            name="city"
                            placeholder="City (auto-filled)"
                            value={formData.city}
                            style={inputStyle}
                        />
                        <button style={btnStyle} type="submit">Post Job</button>
                    </form>
                </div>
            )}

            <h3 style={{ marginBottom: "1rem" }}>Your Jobs</h3>
            {jobs.length === 0 ? (
                <p>No jobs found.</p>
            ) : (
                [...jobs].reverse().map(job => (
                    <div
                        key={job._id}
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "6px",
                            padding: "1rem",
                            marginBottom: "1.5rem",
                            background: "#fff",
                            boxShadow: "0 0 4px rgba(0,0,0,0.05)"
                        }}
                    >
                        <h4 style={{ marginBottom: "0.5rem" }}>{job.title}</h4>
                        <p>{job.description}</p>
                        <p><strong>Status:</strong> <span style={{ color: job.status === "done" ? "green" : job.status === "assigned" ? "orange" : "#333" }}>{job.status}</span></p>
                        <p><strong>Technician:</strong> {job.assignedTo?.name || "Not assigned"}</p>
                        <p><strong>Phone:</strong> {job.assignedTechnicianPhone || "Not assigned"}</p>
                        {user?.role === "customer" && job.status === "assigned" && (
                            <>
                                <button style={btnStyle} onClick={() => {
                                    setSelectedJobId(job._id);
                                    setShowRatingModal(true);
                                }}>Mark as Done</button>
                                <button
                                    style={{ ...btnStyle, background: "#dc3545", marginLeft: "0.5rem" }}
                                    onClick={() => handleChangeTechnician(job._id)}
                                >
                                    Change Technician
                                </button>
                            </>
                        )}
                        {job.status === "open" && recommendations[job._id]?.length > 0 && (
                            <div style={{ marginTop: "1rem", padding: "0.5rem", background: "#f9f9f9", borderRadius: "6px" }}>
                                <strong>Suggested Technicians:</strong>
                                <ul>
                                    {recommendations[job._id].slice(0, 5).map(tech => (
                                        <li key={tech._id} style={{ display: "flex", justifyContent: "space-between" }}>
                                            <span>{tech.name} — {tech.phone}</span>
                                            <span>⭐{(tech.averageRating || 0).toFixed(1)} ({tech.ratingCount || 0})</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {showRatingModal && (
                            <div style={{
                                position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                                background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center"
                            }}>
                                <div style={{
                                    background: "#fff", padding: "2rem", borderRadius: "8px",
                                    boxShadow: "0 0 10px rgba(0,0,0,0.2)", textAlign: "center", width: "400px"
                                }}>
                                    <h3>Rate the Technician</h3>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            onClick={() => setRating(star)}
                                            style={{
                                                fontSize: "2rem",
                                                color: rating >= star ? "#ffcc00" : "#ccc",
                                                cursor: "pointer"
                                            }}
                                        >★</span>
                                    ))}
                                    <br />
                                    <textarea
                                        placeholder="Write a short review..."
                                        value={review}
                                        onChange={(e) => setReview(e.target.value)}
                                        style={{
                                            width: "100%",
                                            height: "80px",
                                            marginTop: "1rem",
                                            padding: "0.5rem",
                                            borderRadius: "5px",
                                            border: "1px solid #ccc",
                                            resize: "none"
                                        }}
                                    />
                                    <button style={{ ...btnStyle, marginTop: "1rem" }} onClick={async () => {
                                        if (!rating) return alert("Please select a rating.");
                                        try {
                                            await axios.patch(`https://serviohub.onrender.com/api/jobs/${selectedJobId}/complete`, {
                                                rating,
                                                review
                                            }, {
                                                headers: { Authorization: `Bearer ${token}` }
                                            });
                                            setShowRatingModal(false);
                                            setRating(0);
                                            setReview(""); // Reset after submission
                                            fetchJobs();
                                        } catch (err) {
                                            console.error("Rating submission failed:", err.response?.data || err.message);
                                            alert("Failed to submit rating");
                                        }
                                    }}>Submit</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

const inputStyle = {
    width: "100%",
    padding: "0.6rem",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
    boxSizing: "border-box"
};

const btnStyle = {
    padding: "0.6rem 1rem",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
};

export default Dashboard;
