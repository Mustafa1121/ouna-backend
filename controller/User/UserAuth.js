const User = require("../../models/User/UserModel");
const crypto = require("crypto");

// Helper function
const createSendToken = require("../../helpers/sendToken").createSendToken;
const sendMail = require("../../helpers/sendEmail").sendMail;

// Login
exports.login = async (req, res) => {
  try {
    // check is the user email exist
    const user = await User.findOne({ email: req.body.email });
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
  const { Fname, Lname, email, password, phone, countryCode } = req.body;
  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    // Create new user
    user = new User({
      Fname,
      Lname,
      email,
      password,
      phone,
      countryCode,
    });

    // Save user to database
    await user.save();
    await exports.verifyEmail(req, res);
    createSendToken(user, 201, res);
  } catch (error) {}
};

// Verify Email
exports.verifyEmail = async (req, res) => {
  const { email } = req.body;
  try {
    // Check if user exists
    let user = await User.findOne({ email });
    console.log(user)
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(20).toString("hex");
    user.verificationToken = verificationToken;
    await user.save({ validateBeforeSave: false });

    // send email
    await sendMail({
      email: email,
      subject: "Account Verification",
      message: `Hello ${
        user.Fname
      },\n\nPlease click on the following link to verify your account:\n\n${
        req.protocol
      }://${req.get(
        "host"
      )}/api/user/auth/verify-email/${verificationToken}\n\nIf you did not request this, please ignore this email.\n`,
    });

    // Send success response
    res.json({ msg: "Verification email sent" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: 'Server error'
    });
  }
};

// Verify Email TOKEN !
exports.verifyEmailToken = async (req, res) => {
  const { token } = req.params;
  try {
    // Check if user with verification token exists
    let user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ msg: "Invalid verification token" });
    }

    // Verify user's email
    user.isEmailVerified = true;
    user.verificationToken = undefined;
    await user.save({ validateBeforeSave: false });

    // Send success response
    res.json({ msg: "Email verified successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Forget Password
exports.forgotPassword = async (req, res) => {
  try {
    // check if the user exist
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: "The user doesn't exist",
      });
    }
    // create the reset token to be sent -> email
    const resetToken = user.generateResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    // send the token via email
    // 3.1 create url
    const url = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/resetPassword/${resetToken}`;
    const msg = `Forgot your password? Reset it by following this link ${url}`;

    // 3.2 send mail
    try {
      await sendMail({
        email: user.email,
        subject: "Your Password reset token: Valid for 10 min",
        message: msg,
      });
      res.status(200).json({
        status: "success",
        message: "The reset link was delivered to your email successfully",
      });
    } catch (error) {
      console.log(error);
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      res.status(500).json({
        message:
          "An error occurred while sending an email, please try again in a moment",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    // get the token
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        message: "The token is invalid, or expired. Please request a new one",
      });
    }

    if (req.body.password.length < 8) {
      return res.status(400).json({
        message: "Password length is too short",
      });
    }

    if (req.body.password !== req.body.passwordConfirm) {
      return res.status(400).json({
        message: "Password & PasswordConfirm are not the same",
      });
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    user.passwordChangedAt = Date.now();

    await user.save();
    return res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
  }
};
