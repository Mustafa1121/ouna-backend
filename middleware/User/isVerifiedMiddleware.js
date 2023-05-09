const User = require("../../models/User/UserModel");
const jwt = require("jsonwebtoken");

const UserVerifiedMiddleAware = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token || !token.startsWith("Bearer")) {
    return res.status(400).json({ message: "Not authorized." });
  }
  if (token.split(" ")[1]) {
    jwt.verify(
      token.split(" ")[1],
      process.env.JWT_SECRET,
      async (err, decodedToken) => {
        if (err) {
          console.log(err);
          req.user = null;
          return res.status(400).json({ message: "Token expired!" });
        } else {
          let user = await User.findById(decodedToken.id);
          if (user && user.isEmailVerified) { // check if user is verified
            req.user = user;
            next();
          } else {
            req.user = null;
            return res.status(400).json({ message: "User is not verified!" });
          }          
        }
      }
    );
  } else {
    req.user = null;
    return res.status(400).json({ message: "Token Invalid!" });
  }
};
module.exports = UserVerifiedMiddleAware;

