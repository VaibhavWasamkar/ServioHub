const express = require('express');
const router = express.Router();
const Technician = require('../models/Technician');

// GET /api/technicians/match?title=Computer%20Repair&city=Pune
router.get('/match', async (req, res) => {
  try {
    const { title, city } = req.query;

    if (!title) {
      return res.status(400).json({ error: 'Job title is required' });
    }

    const titleKeyword = title.trim().toLowerCase();
    const query = {
      expertise: { $regex: new RegExp(titleKeyword, 'i') }
    };

    if (city) {
      query.city = city;
    }

    const technicians = await Technician.find({
        expertise: req.query.title,
        city: req.query.city
    }).sort({ averageRating: -1, ratingCount: -1 }).limit(5);

    res.json(technicians);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
