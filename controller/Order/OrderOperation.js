const Order = require("../../models/Order/OrderModel");
const Product = require("../../models/Product/ProductModel");
const Cart = require("../../models/Cart/CartModel");
const Address = require("../../models/Address/AddressModel");
const { sendMail } = require("../../helpers/sendEmail");
const axios = require("axios");
const { getUnitPrice } = require("../../helpers/getUnitPrice");

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
    console.log("hiii");
    const { cartId, addressId, preferredTime, country } = req.body;

    console.log(addressId);

    // Get the cart with the given ID
    const cart = await Cart.findById(cartId).populate("itemsArray");
    console.log(cart);

    // Calculate the total price of the items in the cart
    const totalPrice = await calculateTotalPrice(cart.itemsArray);

    //getAddress
    const address = await Address.findById(addressId);
    console.log(address);

    // Call the Mylerz API to create a new shipment
    const response = await axios.post(
      "http://41.33.122.61:8888/MylerzIntegrationStaging/api/Orders/AddOrders",
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
        Street: address.additionalAddressInfo,
        Country: country,
        City: address.city,
        Currency: getUnitPrice(country),
        Pieces: cart.itemsArray.map((item) => ({
          PieceNo: item._id,
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

    // send email for the customer
    await sendMail({
      email: req.user.email,
      subject: "Your order is on its way!",
      message: `Dear ${req.user.Fname},\n\nYour order with reference number ${cartId} is on its way. You can expect to receive it within the next few days. \n\nThank you for shopping with us!\n\nBest regards`,
    });

    // send email for the owner
    const productOwner = await User.findById(cart.itemsArray[0].product.owner);
    await sendMail({
      email: productOwner.email,
      subject: "Your product has been sold!",
      message: `Your product (${cart.itemsArray[0].product.name}) has been sold and is being shipped to ${req.user.Fname} ${req.user.Lname}.`,
    });

    // Remove the products from the Products collection
    for (let i = 0; i < cart.itemsArray.length; i++) {
      const product = cart.itemsArray[i].product;
      await Product.findByIdAndDelete(product._id);
    }

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
