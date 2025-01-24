const User = require("../models/userModal");
const OTP = require("../models/otpModal");
const { generateOtp, sendOTPEmail } = require("../utils/otpHandler");
const {verifyToken} = require("../utils/jwtHandler");
const sendResetPasswordEmail = require('../services/emailService');
require("dotenv").config();

// exports.registerUser = async ({ firstName, lastName, email, password }) => {
//   const user = new User({ firstName, lastName, email, password });
//   return await user.save();
// };

exports.loginUser = async ({ email }) => {
  const otp = generateOtp(email);
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10);
  const otpDocument = new OTP({
    email,
    otp,
    expiresAt,
  });
  await otpDocument.save();
  await sendOTPEmail(email, otp);
};

exports.validateOTP = async (email, otp) => {
  const record = await OTP.findOne({ email, otp });
  if (!record) throw new Error("Invalid OTP.");

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  await OTP.deleteMany({ email });

  return token;
};

exports.validateEmail = async (token) => {
  const decoded = verifyToken(token);
  const user = await User.findById(decoded._id);

  if (!user) {
    console.log("user not found");
    throw new Error("Invalid or expired token");
  }

  if (user.isVerified) {
    throw new Error("Email already verified");
  }

  user.isVerified = true;
  await user.save();
};

exports.sendResetPasswordEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found.");

  const token = generateToken({ _id: user._id, email: user.email }, "15m");

  await sendResetPasswordEmail(user.email,token);
};

exports.resetPassword = async (token, newPassword)   => {
  const { _id } = verifyToken(token);
  const user = await User.findById(_id);
  if (!user) throw new Error("Invalid or expired token.");

  user.password = newPassword;
  await user.save();
};
