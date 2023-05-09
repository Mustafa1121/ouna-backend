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
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
