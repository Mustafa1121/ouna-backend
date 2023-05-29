const Order = require("../../models/Order/OrderModel");
const Product = require("../../models/Product/ProductModel");
const Cart = require("../../models/Cart/CartModel");
const Address = require("../../models/Address/AddressModel");
const User = require("../../models/User/UserModel");
const { sendMail } = require("../../helpers/sendEmail");
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
    const { cartId, addressId, preferredTime, country } = req.body;

    // Get the cart with the given ID
    const cart = await Cart.findById(cartId).populate("itemsArray");

    // Calculate the total price of the items in the cart
    const totalPrice = await calculateTotalPrice(cart.itemsArray);

    //getAddress
    const address = await Address.findById(addressId);

    //get reviever
    const user = await User.findById(req.user._id);

    // Create a new order document
    const order = new Order({
      totalPrice,
      items: cart.itemsArray,
      status: "Pending",
      address: addressId,
      preferredTime,
      country,
    });
    for (var i = 0; i < cart.itemsArray.length; i++) {
      const product = await Product.findById(cart.itemsArray[i]);
      const owner = await User.findById(product.owner);
      if (product.origin === "Senegal" || product.origin === "Côte d'Ivoire") {
        await axios.post(
          "https://api.papslogistics.com/tasks/",
          JSON.stringify({
            type: "PICKUP",
            datePickup: preferredTime,
            timePickup: "11:00",
            vehicleType: "CAR",
            address: address.fullAdress,
            receiver: {
              firstname: user.Fname,
              lastname: user.Lname,
              phoneNumber: user.phone,
              email: user.email,
              address: address.fullAddres,
              specificationAddress: address.additionalAddressInfo,
            },
            parcels: [
              {
                identity_of_pickup_address: {
                  address_pickup: product.location,
                  firstName: owner.Fname,
                  lastName: owner.Lname,
                  phoneNumber: owner.phone,
                },
                description: product.description,
                price: product.price,
                amountCollect: product.price,
                additionalInfo: "Pay attention",
                isFromApi: true,
              },
            ],
          })
        );
      }

      // send email for the customer
      // await sendMail({
      //   email: req.user.email,
      //   subject: "Your order is on its way!",
      //   message: `Dear ${req.user.Fname},\n\nYour order with reference number ${cartId} is on its way. You can expect to receive it within the next few days. \n\nThank you for shopping with us!\n\nBest regards`,
      // });

      // // send email for the owner
      // const productOwner = await User.findById(cart.itemsArray[0].owner);
      // console.log(productOwner)
      // await sendMail({
      //   email: productOwner.email,
      //   subject: "Your product has been sold!",
      //   message: `Your product (${cart.itemsArray[0].name}) has been sold and is being shipped to ${req.user.Fname} ${req.user.Lname}.`,
      // });

      // Remove the products from the Products collection
      for (let i = 0; i < cart.itemsArray.length; i++) {
        const product = cart.itemsArray[i];
        await Product.findByIdAndDelete(product);
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
    }
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
