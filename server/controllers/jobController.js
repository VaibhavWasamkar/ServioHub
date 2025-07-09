const Job = require("../models/Job");
const TechnicianPhone = require('../models/Technician');

exports.createJob = async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      postedBy: req.user._id || req.user.id,
      postedByModel: req.user.role === "customer" ? "Customer" : "Technician"
    });
    res.status(201).json(job);
  } catch (err) {
    console.error("Error creating job:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const allJobs = await Job.find()
      .populate({
        path: "postedBy",
        select: "name phone"
      })
      .populate({
        path: "assignedTo",
        select: "name phone",
        model: "Technician"
      });

    let jobs = allJobs;

    if (req.user) {
      const userId = req.user._id?.toString() || req.user.id;
      const role = req.user.role;

      if (role === "customer") {
        jobs = allJobs.filter(job => job.postedBy?._id?.toString() === userId);
      } else if (role === "technician") {
        jobs = allJobs.filter(job => job.assignedTo?._id?.toString() === userId);
      }
    }

    res.json(jobs);
  } catch (err) {
    console.error("Error fetching jobs:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const update = { ...req.body };

    // If unassigning technician
    if (req.body.assignedTo === null || req.body.assignedTo === "") {
      update.assignedTo = null;
      update.assignedToModel = null;
      update.assignedTechnicianPhone = null;
      update.status = "open";
    }

    // If assigning a technician and no model provided
    if (req.body.assignedTo && !req.body.assignedToModel) {
      update.assignedToModel = "Technician";

      const tech = await TechnicianPhone.findById(req.body.assignedTo).select("phone");
      if (tech?.phone) {
        update.assignedTechnicianPhone = tech.phone;
      }
    }

    const job = await Job.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate({ path: "postedBy", select: "name phone" })
      .populate({ path: "assignedTo", select: "name phone" });

    res.json(job);
  } catch (err) {
    console.error("Error updating job:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.completeJobWithRating = async (req, res) => {
    try {
        const jobId = req.params.id;
        const { rating, review } = req.body;

        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ error: "Job not found" });

        if (!job.assignedTo) return res.status(400).json({ error: "No technician assigned" });

        // Update job with done status, review
        job.status = "done";
        if (review) job.review = review;

        await job.save();

        // Update technician's rating
        const technician = await TechnicianPhone.findById(job.assignedTo);
        if (technician) {
            technician.totalRatings = (technician.totalRatings || 0) + 1;
            technician.rating = ((technician.rating || 0) * ((technician.totalRatings || 1) - 1) + rating) / technician.totalRatings;
            await technician.save();
        }

        res.json({ message: "Job completed and technician rated" });
    } catch (err) {
        console.error("Error in completeJobWithRating:", err);
        res.status(500).json({ error: "Failed to complete job" });
    }
};




