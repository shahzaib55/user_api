const transporter = require("../config/mailer");
const { authenticator } = require("otplib");

exports.generateOtp = (email) => {
  return authenticator.generate(email); 
};
exports.sendOTPEmail = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
  });
};
