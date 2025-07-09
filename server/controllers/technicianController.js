const Technician = require('../models/Technician');

exports.getMatchingTechnicians = async (req, res) => {
  const { title, pincode } = req.query;

  try {
    const matched = await Technician.find({
      expertise: { $regex: title, $options: "i" },
      pincode,
      status: "approved"
    });

    res.json(matched);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
