const {
  updatePassword,
} = require("../services/passwordService");
const { sendResetPasswordEmail } = require("../services/emailService");
const {verifyToken} = require("../utils/jwtHandler");
const User = require("../models/userModal");
const { generateToken } = require("../utils/jwtHandler");

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const resetToken = generateToken(user._id, user.email);
    await sendResetPasswordEmail(email, resetToken);

    res
      .status(200)
      .json({ message: "Password reset link sent to your email." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong.", error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
  
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = verifyToken(token);
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    await updatePassword(user._id, newPassword);

    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong.", error: error.message });
  }
};
