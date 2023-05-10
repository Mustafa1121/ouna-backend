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

// Check out the cart and create a new order
exports.checkout = async (req, res) => {
  try {
    const { cartId, addressId, preferredTime, country } = req.body;

    // Get the cart with the given ID
    const cart = await Cart.findById(cartId).populate("itemsArray.product");

    // Calculate the total price of the items in the cart
    const totalPrice = await calculateTotalPrice(cart.itemsArray);

    // Call the Mylerz API to create a new shipment
    const response = await axios.post(
      "http://41.33.122.61:8888/MylerzIntegrationStaging/api",
      {
        PickupDueDate: preferredTime,
        Package_Serial: 1,
        Reference: cartId,
        Description: "A package with " + cart.itemsArray.length + " items",
        Service_Type: "DTD",
        Service: "SD",
        ServiceDate: new Date().toISOString(),
        Service_Category: "Delivery",
        Payment_Type: "COD",
        COD_Value: totalPrice,
        Customer_Name: req.user.Fname + " " + req.user.Lname,
        Mobile_No: req.user.phone,
        Street: addressId.additionalAddressInfo,
        Country: country,
        City: addressId.city,
        Currency: exports.getUnitPrice(country),
        Pieces: cart.itemsArray.map((item) => ({
          PieceNo: item.product._id,
        })),
      }
    );

    console.log(response);

    // Create a new order document
    const order = new Order({
      totalPrice,
      items: cart.itemsArray,
      status: "Pending",
      address: addressId,
      preferredTime,
      country,
    });

    // Save the order document to the database
    await order.save();

    // Clear the cart
    cart.itemsArray = [];
    await cart.save();

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
