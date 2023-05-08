const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  addressOwner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  fname: {
    type: String,
    required: true,
    trim: true,
  },
  lname: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
    required: true,
  },
  countryCode: {
    type: String,
    trim: true,
    required: true,
  },
  city: {
    type: String,
    trim: true,
    required: true,
  },
  fullAddress: {
    type: String,
    trim: true,
    required: true,
  },
  additionalAddressInfo: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model("Address", addressSchema);
