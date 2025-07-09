const Customer = require("../models/Customer");
const Technician = require("../models/Technician");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { role, email, password, ...rest } = req.body;
  const Model = role === "technician" ? Technician : Customer;

  try {
    const existingUser = await Model.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Model({
      ...rest,
      email,
      password: hashedPassword,
      role,
      ...(role === "technician" && { status: "pending" }) // set status only for technicians
    });

    await newUser.save();
    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await Customer.findOne({ email });
    let role = "customer";

    if (!user) {
      user = await Technician.findOne({ email });
      role = "technician";
    }

    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    if (role === "technician" && user.status !== "approved") {
      return res.status(403).json({ error: "Your account is under review. Please wait for admin approval." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      user: {
        id: user._id,
        name: user.name,
        role,
        status: user.status || "approved",
        ...(user.role === "technician" && { expertise: user.expertise }) // 👈 Conditionally add expertise
      },
      token
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
