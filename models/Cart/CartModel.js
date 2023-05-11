const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  cartOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  itemsArray: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

module.exports = mongoose.model("Cart", cartSchema);
