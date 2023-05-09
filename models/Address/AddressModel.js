const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  addressOwner: {
    type: Schema.Types.ObjectId,
    ref: "user",
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
