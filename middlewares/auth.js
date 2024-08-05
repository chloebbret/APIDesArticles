const jwt = require("jsonwebtoken");
const config = require("../config");
const UnauthorizedError = require("../errors/unauthorized");
const User = require("../api/users/users.model");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      throw new UnauthorizedError("No token provided");
    }

    const decoded = jwt.verify(token, config.secretJwtToken);
    req.user = await User.findById(decoded.userId);
    if (!req.user) {
      throw new UnauthorizedError("User not found");
    }

    next();
  } catch (err) {
    next(new UnauthorizedError(err.message));
  }
};
