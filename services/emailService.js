const sendEmail = require("../utils/email");
const templates = {
  verification: `<p>Please verify your email by clicking the link below:</p>
                   <a href="{{url}}">Verify Email</a>`,
  resetPassword: `<p>You requested a password reset. Click the link below to reset your password:</p>
                    <a href="{{url}}">Reset Password</a>`,
};
const sendVerificationEmail = (email, verificationToken) => {
  const url = `${process.env.CLIENT_URL}api/auth/verify-email/${verificationToken}`;
  return sendEmail(email, "Verify Your Email", templates.verification, { url });
};

const sendResetPasswordEmail = (email, resetToken) => {
  const url = `${process.env.CLIENT_URL}api/auth/reset-password/${resetToken}`;
  return sendEmail(email, "Reset Your Password", templates.resetPassword, {
    url,
  });
};

module.exports = {
  sendVerificationEmail,
  sendResetPasswordEmail,
};
