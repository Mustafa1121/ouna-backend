const Order = require("../../models/Order/OrderModel");
const Product = require("../../models/Product/ProductModel");
const Cart = require("../../models/Cart/CartModel");

// helpers
const calculateTotalPrice = async (itemsArray) => {
  let totalPrice = 0;
  for (let i = 0; i < itemsArray.length; i++) {
    const item = await Product.findById(itemsArray[i]);
    if (item) {
      totalPrice += item.price;
    }
  }
  return totalPrice;
};

exports.createOrder = async (req, res) => {
  try {
    const { cartId, addressId, preferredTime } = req.body;

    // Get the cart with the given ID
    const cart = await Cart.findById(cartId);

    // Calculate the total price of the items in the cart
    const totalPrice = await calculateTotalPrice(cart.itemsArray);

    // Create a new order document
    const order = new Order({
      totalPrice,
      cart: cart._id,
      status: "Pending",
      address: addressId,
      preferredTime,
    });

    // Save the order document to the database
    await order.save();

    // Send the order document as the response
    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    // Find the order by ID
    const order = await Order.findById(req.params.orderId);

    // Check if the order exists
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Update the order status
    order.status = req.body.status;

    // Save the updated order to the database
    await order.save();

    // Return the updated order object in the response
    res.json({
      message: "Order status updated successfully",
      order: order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating order status",
      error: error,
    });
  }
};
