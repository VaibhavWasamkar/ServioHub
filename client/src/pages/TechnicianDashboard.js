import { useCallback, useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TechnicianDashboard = () => {
    const { user, token } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);
    const navigate = useNavigate();

    const fetchJobs = useCallback(async () => {
        try {
            const res = await axios.get("https://serviohub.onrender.com/api/jobs", {
                headers: { Authorization: `Bearer ${token}` }
            });

            let filtered = res.data;

            if (user?.role === "technician") {
                const assignedJobs = res.data.filter(
                    job => job.assignedTo?._id === user.id
                );

                const openJobsMatchingExpertise = res.data.filter(
                    job =>
                        job.status === "open" &&
                        !job.assignedTo &&
                        job.title === user.expertise
                );

                filtered = [...assignedJobs, ...openJobsMatchingExpertise];
            }

            setJobs(filtered);
        } catch (err) {
            console.error("Failed to fetch jobs", err);
        }
    }, [token, user]);

    useEffect(() => {
    if (!user || !token) {
        navigate("/login", { replace: true });
    } else {
        fetchJobs();
    }
    }, [token, user, navigate, fetchJobs]);

    const applyToJob = async (jobId) => {
        try {
            await axios.patch(
                `https://serviohub.onrender.com/api/jobs/${jobId}`,
                { assignedTo: user.id, status: "assigned" },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchJobs();
        } catch (err) {
            console.error("Failed to apply to job", err);
            alert("Failed to apply");
        }
    };

    const handleLeaveJob = async (jobId) => {
        try {
            await axios.patch(
                `https://serviohub.onrender.com/api/jobs/${jobId}`,
                { assignedTo: null, assignedToModel: null, status: "open" },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("You have left the job. It is now available to other technicians.");
            fetchJobs();
        } catch (err) {
            alert("Failed to leave job.");
            console.error(err);
        }
    };

    const assignedJobs = jobs.filter(job => job.assignedTo?._id === user?.id && job.status !== "done");
    const doneJobs = jobs.filter(job => job.assignedTo?._id === user?.id && job.status === "done");
    const openJobs = jobs.filter(job => job.status === "open" && !job.assignedTo);

    return (
        <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Welcome, <span style={{ color: "brown" }}>{user?.name}</span></h2>

            <div style={{ marginTop: "2rem" }}>
                <h3>Your Assigned Jobs</h3>
                {assignedJobs.length === 0 ? (
                    <p>You have no assigned jobs.</p>
                ) : (
                    assignedJobs.map((job) => (
                        <div
                            key={job._id}
                            style={jobCardStyle}
                        >
                            <h4>{job.postedBy?.name || "N/A"}</h4>
                            <p>{job.description}</p>
                            <p><strong>Status:</strong> <span style={{ color: job.status === "done" ? "green" : job.status === "assigned" ? "orange" : "#333" }}>{job.status}</span></p>
                            <button
                                style={{ ...btnStyle, background: "#dc3545", marginTop: "0.5rem" }}
                                onClick={() => handleLeaveJob(job._id)}
                            >
                                Leave Job
                            </button>
                        </div>
                    ))
                )}
            </div>

            <hr />

            <div style={{ marginTop: "2rem" }}>
                <h3>Available Jobs</h3>

                {assignedJobs.length >= 5 && (
                    <div style={{ background: "#ffe6e6", padding: "1rem", borderRadius: "6px", color: "#b30000", marginBottom: "1rem" }}>
                        <strong>Limit Reached:</strong> Complete your assigned jobs to get new ones.
                    </div>
                )}

                {openJobs.length === 0 ? (
                    <p>No new jobs available.</p>
                ) : assignedJobs.length < 5 ? (
                    openJobs.reverse().map(job => (
                        <div
                            key={job._id}
                            style={{
                                border: "1px solid #ddd",
                                padding: "1rem",
                                marginBottom: "1rem",
                                borderRadius: "8px",
                                background: "#f9f9f9"
                            }}
                        >
                            <p><strong>{job.postedBy?.name || "N/A"}</strong></p>
                            <p>{job.description}</p>                            
                            <button style={btnStyle} onClick={() => applyToJob(job._id)}>Accept Job</button>                            
                        </div>
                    ))
                ) : null}
            </div>

            <hr />

            <div style={{ marginTop: "2rem" }}>
                <h3>Your Job History</h3>
                {doneJobs.length === 0 ? (
                    <p>No completed jobs yet.</p>
                ) : (
                    doneJobs.reverse().map((job) => (
                        <div
                            key={job._id}
                            style={jobCardStyle}
                        >
                            <h4>{job.postedBy?.name || "N/A"}</h4>
                            <p>{job.description}</p>
                            <p><strong>Status:</strong> <span style={{ color: "green" }}>{job.status}</span></p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const jobCardStyle = {
    border: "1px solid #ddd",
    borderRadius: "6px",
    padding: "1rem",
    marginBottom: "1.5rem",
    background: "#fff",
    boxShadow: "0 0 4px rgba(0,0,0,0.05)"
};

const btnStyle = {
    padding: "0.6rem 1rem",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
};

export default TechnicianDashboard;
