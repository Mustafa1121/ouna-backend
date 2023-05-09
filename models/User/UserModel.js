const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    Fname: {
      type: String,
      trim: true,
      required: true,
    },
    Lname: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "Password too short. Should be at least 8 characters"],
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    countryCode: {
      type: String,
      default: "+961",
      trim: true,
    },
    rating: {
      type: Number,
      max: 5,
      min: 0,
      default: 0,
      trim: true,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    verificationToken: String,
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

// Hash pass before saving
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }

    await this.addToPasswordHistory(this.password);

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
  } catch (error) {
    console.log(error);
  }
});

// comparing password
userSchema.methods.comparePassword = async function (
  plainPassword,
  hashedPassword
) {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// generate for reset password
userSchema.methods.generateResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  // saved in the DB in a hashed way
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  // 10 min of validity
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
