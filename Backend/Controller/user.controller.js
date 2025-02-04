const User = require("../Models/user.models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// ✅ User Signup (Registration)
const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({ email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ User Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "invalid password"});

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expiration time (can be adjusted)
    });

    res.json({
      message: "Login successful",
      token,
      userId: user._id,
      email: user.email,  // Optionally send back the email or other user info if necessary
    });
  } catch (error) {
    console.error("Error during login:", error);  // Log error for debugging
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Get All Users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude passwords for security
    
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Delete User
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete user
    await User.findByIdAndDelete(id);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { registerUser, loginUser, getUsers, deleteUser };
