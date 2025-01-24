const {
  registerUser,
  loginUser,
  validateEmail,
  validateOTP,
} = require("../services/authService");
const {sendVerificationEmail} = require("../services/emailService");
const {generateToken} = require("../utils/jwtHandler");
const User = require("../models/userModal");

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User already exists. Please login instead." });
    }
    const user = new User({ firstName, lastName, email, password });
    await user.save();
    console.log(generateToken);
    const token = await generateToken(user._id, user.email);
    await sendVerificationEmail(user.email, token);
    res
      .status(201)
      .json({ message: "Registration successful. Please verify your email." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const token = await loginUser(req.body);
    res.json({ message: "OTP sent to your email.", token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    console.log(token);
    await validateEmail(token);
    res.json({ message: "Email verified successfully." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const token = await validateOTP(email, otp);
    res.json({ message: "OTP verified successfully.", token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};






