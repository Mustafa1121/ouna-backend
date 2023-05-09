const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  cartOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  itemsArray: [
    {
      type: Schema.Types.ObjectId,
      ref: "Item",
    },
  ],
});

module.exports = mongoose.model("Cart", cartSchema);
