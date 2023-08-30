const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
  },
});

const videoSchema = new mongoose.Schema({
  url: {
    type: String,
  },
});

const productSchema = new mongoose.Schema(
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
    category: { type: mongoose.Schema.ObjectId, ref: "Category" },
    owner: { type: mongoose.Schema.ObjectId, ref: "User" },
    images: {
      type: [imageSchema],
      default: [],
    },
    description: {
      type: String,
      required: true,
      default: "",
    },
    location: {
      type: String,
    },
    video: {
      url: {
        type: String,
      },
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
    rating: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
