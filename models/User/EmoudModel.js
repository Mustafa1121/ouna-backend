const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const emoudSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    trim: true,
  },
  isEmoud: {
    type: Boolean,
    default: true
  },
  password: {
    type: String,
    required: true,
    minLength: [8, "Password too short. Should be at least 8 characters"],
  },
});

emoudSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
  } catch (error) {
    console.log(error);
  }
});
emoudSchema.methods.comparePassword = async function (
  plainPassword,
  hashedPassword
) {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = mongoose.model("EmoudUser", emoudSchema);
