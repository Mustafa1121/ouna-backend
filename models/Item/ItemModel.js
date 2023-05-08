const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
      trim: true,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    imageClassificationController: {
      type: String,
      default: "",
    },
    recycling: {
      type: Boolean,
      default: false,
    },
    category: { type: mongoose.Schema.ObjectId, ref: "category" },
    owner: { type: mongoose.Schema.ObjectId, ref: "user" },
    images: {
      type: [Object],
      default: [],
    },
    description: {
      type: String,
      required: true,
      default: "",
    },
    video: {
      type: String,
      default: "",
    },
    views: {
      type: Number,
      default: 0, // number of view count
    },
    reserved: {
      type: Boolean,
      default: false,
    },
    origin: {
      type: String,
      required: true,
    },
    unitPrice: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: true,
  }
);

module.exports = mongoose.model("Item", itemSchema);
