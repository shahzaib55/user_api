const jwt = require("jsonwebtoken");

exports.generateVerificationToken = (id, email) => {
  return jwt.sign({ _id: id, email: email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

exports.generateSessionToken = (id, email) => {
  return jwt.sign({ _id: id, email: email }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};