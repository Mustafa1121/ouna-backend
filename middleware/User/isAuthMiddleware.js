const User = require("../../models/User/UserModel");
const jwt = require("jsonwebtoken");

const UserMiddleAware = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token || !token.startsWith("Bearer")) {
    return res.status(400).json({ message: "Not authorized." });
  }
  console.log(token);
  if (token.split(" ")[1]) {
    jwt.verify(
      token.split(" ")[1],
      process.env.TOKEN_SECRET,
      async (err, decodedToken) => {
        if (err) {
          req.user = null;
          return res.status(400).json({ message: "Token expired!" });
        } else {
          let user = await User.findById(decodedToken.userId);
          if (user) {
            req.user = user;
            next();
          } else {
            req.user = null;
            return res.status(400).json({ message: "Token expired!" });
          }
        }
      }
    );
  } else {
    req.user = null;
    return res.status(400).json({ message: "Token Invalid!" });
  }
};
module.exports = UserMiddleAware;