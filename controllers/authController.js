const {
  registerUser,
  loginUser,
  validateEmail,
  validateOTP,
} = require("../services/authService");
const { sendVerificationEmail } = require("../services/emailService");
const { generateVerificationToken, generateSessionToken } = require("../utils/jwtHandler");
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

    const verificationToken = await generateVerificationToken(user._id, user.email);
    await sendVerificationEmail(user.email, verificationToken);
    res
      .status(201)
      .json({ message: "Registration successful. Please verify your email." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await loginUser(req.body);
    const sessionToken = await generateSessionToken(user._id, user.email);
    res.cookie('authToken', sessionToken, {
      httpOnly: true,
      secure: true,   
      sameSite: 'Strict', 
      maxAge: 24 * 60 * 60 * 1000, 
    });
    res.json({ message: "OTP sent to your email." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    await validateEmail(token);
    res.json({ message: "Email verified successfully." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await validateOTP(email, otp);
    const sessionToken = await generateSessionToken(user._id, user.email);
    res.cookie('authToken', sessionToken, {
      httpOnly: true, 
      secure: true,   
      sameSite: 'Strict', 
      maxAge: 24 * 60 * 60 * 1000, 
    });
    res.json({ message: "OTP verified successfully." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};