const Cart = require("../../models/Cart/CartModel");
const Product = require("../../models/Product/ProductModel");

// Add an item to the cart
exports.addToCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ cartOwner: req.user._id });
    const item = await Product.findById(req.params.itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.reserved) {
      return res.status(400).json({ message: "Item is already reserved" });
    }
    // Mark the product as reserved
    item.reserved = true;
    await item.save();

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
      return res.status(404).json({ message: "Cart not found" });
    }
    const item = await Product.findById(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    item.reserved = false;
    await item.save();
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
      return res.status(404).json({ message: "Cart not found" });
    }

    // Set the reserved property to false for all items in the cart
    await Promise.all(
      cart.itemsArray.map(async (item) => {
        const product = await Product.findById(item.product);
        if (product) {
          product.reserved = false;
          await product.save();
        }
      })
    );

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
    if(!cart){
      return res.status(404).json({
        message: "No Cart Found",
      });
    }
    if (cart.itemsArray.length == 0) {
      return res.status(404).json({
        message: "No Items Found",
      });
    }
    res.status(200).json({ items: cart.itemsArray, id: cart._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
