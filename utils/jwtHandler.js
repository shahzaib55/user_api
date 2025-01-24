const jwt = require("jsonwebtoken");

exports.generateToken = (id, email) => {
  return jwt.sign({ _id: id, email: email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// module.exports = { generateToken, verifyToken };
