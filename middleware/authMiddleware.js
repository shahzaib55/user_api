const jwt = require("jsonwebtoken");
const User = require("../models/userModal");

exports.protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });
    }

    if (user.googleId && !user.isVerified) {
      return res
        .status(401)
        .json({ message: "Not authorized, Google account not verified" });
    }

    next();
  } catch (error) {
    let message = "Not authorized, token failed";
    if (error.name === "TokenExpiredError") {
      message = "Not authorized, token has expired";
    } else if (error.name === "JsonWebTokenError") {
      message = "Not authorized, invalid token";
    }

    res.status(401).json({ message });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Not authorized, insufficient permissions" });
    }
    next();
  };
};
