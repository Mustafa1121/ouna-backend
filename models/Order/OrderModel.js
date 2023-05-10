const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    totalPrice: {
      type: Number,
      default: 0,
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
    status: {
      type: String,
      enum: ["Pending", "Delivered"],
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    preferredTime: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
