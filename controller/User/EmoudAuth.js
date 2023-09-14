const { createSendToken } = require('../../helpers/sendToken');
const EmoundModel = require('../../models/User/EmoudModel')

exports.login = async (req, res) => {
    try {
      // check is the user email exist
      const user = await EmoundModel.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).json({
          message: "User doesn't exist",
        });
      }
      // check if the entered password is matching thr hashed one
      if (!(await user.comparePassword(req.body.password, user.password))) {
        return res.status(401).json({
          message: "Incorrect Credentials",
        });
      }
  
      // check if the user's email is verified
      if (!user.isEmailVerified) {
        return res.status(401).json({
          message: "Email is not verified",
        });
      }
  
      // if everything is oke Log the user in
      createSendToken(user, 200, res);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

  // Register
exports.register = async (req, res) => {
    const { email, password } = req.body;
    try {
      // Check if user already exists
      let user = await EmoundModel.findOne({ email });
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }
      // Create new user
      user = new EmoundModel({
        email,
        password
      });
  
      // Save user to database
      await user.save();
      createSendToken(user, 201, res);
    } catch (error) {
        res.status(500).json({
            message: error.message,
          });
    }
  };