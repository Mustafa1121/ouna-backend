const jwt = require("jsonwebtoken");

exports.signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
