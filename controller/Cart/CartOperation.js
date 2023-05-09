const Cart = require("../../models/Cart/Cart");
const Product = require("../../models/Product/ProductModel");

// Add an item to the cart
exports.addToCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ cartOwner: req.user._id });
    const item = await Product.findById(req.params.itemId);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    if (!cart) {
      const newCart = new Cart({ cartOwner: req.user._id });
      newCart.itemsArray.push(item._id);
      await newCart.save();
      return res.status(200).json(newCart);
    }

    cart.itemsArray.push(item._id);
    await cart.save();
    return res.status(200).json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Delete an item by its ID from the cart
exports.deleteFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ cartOwner: req.user._id });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.itemsArray.pull(req.params.itemId);
    await cart.save();
    return res.status(200).json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Clear the cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ cartOwner: req.user._id });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.itemsArray = [];
    await cart.save();
    return res.status(200).json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getCartItems = async (req, res) => {
    try {
      const cart = await Cart.findOne({ cartOwner: req.user._id }).populate(
        "itemsArray"
      );
      res.status(200).json({ items: cart.itemsArray });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };

