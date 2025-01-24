// Change to default export
const transporter = require("../config/mailer");

const sendEmail = async (email, subject, template, data) => {
  const html = template.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] || "");

  await transporter.sendMail({
    to: email,
    subject,
    html,
  });
};

module.exports = sendEmail;
