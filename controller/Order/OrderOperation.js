const Order = require("../../models/Order/OrderModel");
const Product = require("../../models/Product/ProductModel");
const Cart = require("../../models/Cart/CartModel");
const Address = require("../../models/Address/AddressModel");
const User = require("../../models/User/UserModel");
const { sendMail } = require("../../helpers/sendEmail");
const { getUnitPrice } = require("../../helpers/getUnitPrice");
const { default: axios } = require("axios");
const AddressModel = require("../../models/Address/AddressModel");

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

    console.log(address);

    //get receiver
    const user = await User.findById(req.user._id);

    console.log(user);

    console.log(preferredTime);
    // Create a new order document
    const order = new Order({
      totalPrice,
      items: cart.itemsArray,
      status: "Pending",
      address: addressId,
      preferredTime,
      country,
    });

    const dateObject = new Date(preferredTime);
    const timestampMilliseconds = dateObject.getTime();

    // Iterate over the items
    for (var i = 0; i < cart.itemsArray.length; i++) {
      // get single product
      const product = await Product.findById(cart.itemsArray[i]);
      // its owner
      const owner = await User.findById(product.owner);

      console.log(timestampMilliseconds);

      // aramex
      const responseBody = {
        Shipments: [
          {
            Reference1: "",
            Reference2: "",
            Reference3: "",
            Shipper: {
              Reference1: "",
              Reference2: "",
              AccountNumber: "20016",
              PartyAddress: {
                Line1: "Test From Jordan",
                Line2: "",
                Line3: "",
                City: "Amman",
                StateOrProvinceCode: "",
                PostCode: "00000",
                CountryCode: "JO",
                Longitude: 0.0,
                Latitude: 0.0,
                BuildingNumber: null,
                BuildingName: null,
                Floor: null,
                Apartment: null,
                POBox: null,
                Description: null,
              },
              Contact: {
                Department: "Cosmetic",
                PersonName: "Main Warehous",
                Title: "Main Title",
                CompanyName: "Store",
                PhoneNumber1: "+96227272240",
                PhoneNumber1Ext: "",
                PhoneNumber2: "",
                PhoneNumber2Ext: "",
                FaxNumber: "",
                CellPhone: "+96227272240",
                EmailAddress: "xyz@jordan.com",
                Type: "",
              },
            },
            Consignee: {
              Reference1: "",
              Reference2: "",
              AccountNumber: "",
              PartyAddress: {
                Line1: "Test to Egypt",
                Line2: "",
                Line3: "",
                City: address.city,
                StateOrProvinceCode: "",
                PostCode: "00000",
                CountryCode: "LB",
                Longitude: 0.0,
                Latitude: 0.0,
                BuildingNumber: null,
                BuildingName: null,
                Floor: null,
                Apartment: null,
                POBox: null,
                Description: null,
              },
              Contact: {
                Department: "Cosmetic",
                PersonName: user.Fname,
                Title: "Title Consignee",
                CompanyName: "Store",
                PhoneNumber1: user.phone,
                PhoneNumber1Ext: "",
                PhoneNumber2: "",
                PhoneNumber2Ext: "",
                FaxNumber: "",
                CellPhone: "+201175451475",
                EmailAddress: user.email,
                Type: "",
              },
            },
            ThirdParty: {
              Reference1: "",
              Reference2: "",
              AccountNumber: "",
              PartyAddress: {
                Line1: "",
                Line2: "",
                Line3: "",
                City: "",
                StateOrProvinceCode: "",
                PostCode: "",
                CountryCode: "",
                Longitude: 0.0,
                Latitude: 0.0,
                BuildingNumber: null,
                BuildingName: null,
                Floor: null,
                Apartment: null,
                POBox: null,
                Description: null,
              },
              Contact: {
                Department: "",
                PersonName: "",
                Title: "",
                CompanyName: "",
                PhoneNumber1: "",
                PhoneNumber1Ext: "",
                PhoneNumber2: "",
                PhoneNumber2Ext: "",
                FaxNumber: "",
                CellPhone: "",
                EmailAddress: "",
                Type: "",
              },
            },
            ShippingDateTime: "/Date(1692621629000)/",
            DueDate: "/Date(" + timestampMilliseconds + ")/",
            Comments: "Comment",
            PickupLocation: product.location,
            OperationsInstructions: "Operation Instructions",
            AccountingInstrcutions: "Accounting Instrucation",
            Details: {
              Dimensions: {
                Length: 10.0,
                Width: 10.0,
                Height: 10.0,
                Unit: "cm",
              },
              ActualWeight: {
                Unit: "KG",
                Value: 7.0,
              },
              ChargeableWeight: null,
              DescriptionOfGoods: "BOX",
              GoodsOriginCountry: "JO",
              NumberOfPieces: 1,
              ProductGroup: "EXP",
              ProductType: "PPX",
              PaymentType: "P",
              PaymentOptions: "",
              CustomsValueAmount: {
                CurrencyCode: "USD",
                Value: 10.0,
              },
              CashOnDeliveryAmount: {
                CurrencyCode: "USD",
                Value: product.price,
              },
              InsuranceAmount: null,
              CashAdditionalAmount: null,
              CashAdditionalAmountDescription: "",
              CollectAmount: null,
              Services: "CODS",
              Items: [
                {
                  PackageType: "BOX",
                  Quantity: 1,
                  Weight: {
                    Unit: "KG",
                    Value: 7.0,
                  },
                  Comments: "Items",
                  Reference: "Item Refernce",
                  PiecesDimensions: null,
                  CommodityCode: null,
                  GoodsDescription: null,
                  CountryOfOrigin: null,
                  CustomsValue: null,
                  ContainerNumber: null,
                },
              ],
              DeliveryInstructions: null,
              AdditionalProperties: null,
              ContainsDangerousGoods: false,
            },

            ForeignHAWB: "",
            "TransportType ": 0,
            PickupGUID: "",
            Number: null,
            ScheduledDelivery: null,
          },
        ],
        LabelInfo: {
          ReportID: 9729,
          ReportType: "URL",
        },
        ClientInfo: {
          UserName: "testingapi@aramex.com",
          Password: "R123456789$r",
          Version: "1.0",
          AccountNumber: "20016",
          AccountPin: "331421",
          AccountEntity: "AMM",
          AccountCountryCode: "JO",
          Source: 24,
          PreferredLanguageCode: null,
        },
        Transaction: {
          Reference1: "Transaction 1",
          Reference2: "Transaction 2",
          Reference3: "Transaction 3",
          Reference4: "Transaction 4",
          Reference5: "Transaction 5",
        },
      };

      try {
        const response = await axios.post(
          "https://ws.sbx.aramex.net/ShippingAPI.V2/Shipping/Service_1_0.svc/json/CreateShipments",
          responseBody
        );
      } catch (error) {
        console.error(error.response.data.message);
        return res.status(500).json({
          message: "Server error",
        });
      }
      // Getting token
      if (product.origin === "Egypt") {
        const requestBody = {
          WarehouseName: product.location, // Replace with the actual pickup location
          PickupDueDate: preferredTime, // Replace with the preferred pickup date and time
          Package_Serial: product._id, // Replace with the unique package identifier
          Reference: product._id, // Replace with the reference key
          Description: product.description, // Replace with the package description
          Service_Type: "", // Replace with the service type lookup value
          Service: "", // Replace with the service lookup value
          Service_Category: "Service category", // Replace with the service category lookup value
          Payment_Type: "Cash on Delivery", // Replace with the payment type lookup value (optional)
          COD_Value: product.price, // Replace with the COD value of the package
          Pieces: [
            {
              PieceName: "Piece name",
              PieceWeight: 1.5, // Replace with the weight of the piece
              PieceValue: 100, // Replace with the value of the piece
            },
          ],
          Special_Notes: "Special notes", // Replace with any special notes for the package (optional)
          Customer_Name: user.Fname, // Replace with the package receiver's name
          Mobile_No: user.phone, // Replace with the package receiver's phone number
        };

        // Getting the token
        const responseToken = await axios.post(
          "http://41.33.122.61:8888/MylerzIntegrationStaging/token",
          {
            username: "OUNAAPP",
            password: "L!4RM2|OL]7r1a",
          }
        );

        const token = responseToken.data.access_token;

        try {
          const response = await axios.post(
            "http://41.33.122.61:8888/MylerzIntegrationStaging/api/Orders/AddOrders",
            requestBody,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (error) {
          console.error(error);
          return res.status(500).json({
            message: "Server error",
          });
        }

        // send email for the customer
        await sendMail({
          email: req.user.email,
          subject: "Your order is on its way!",
          message: `Dear ${req.user.Fname},\n\nYour order with reference number ${cartId} is on its way. You can expect to receive it within the next few days. \n\nThank you for shopping with us!\n\nBest regards`,
        });

        // // send email for the owner
        await sendMail({
          email: owner.email,
          subject: "Your product has been sold!",
          message: `Your product (${cart.itemsArray[i].name}) has been sold and is being shipped to ${req.user.Fname} ${req.user.Lname}.`,
        });
      }

      // Remove the products from the Products collection
      // for (let i = 0; i < cart.itemsArray.length; i++) {
      //   const product = cart.itemsArray[i];
      //   await Product.findByIdAndDelete(product);
      // }

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
    return res.status(500).json({
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
