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

    //get receiver
    const user = await User.findById(req.user._id);

    // Create a new order document
    const order = new Order({
      totalPrice,
      items: cart.itemsArray,
      status: "Pending",
      address: addressId,
      preferredTime,
      country,
      cart: cartId
    });

    const dateObject = new Date(preferredTime);
    const timestampMilliseconds = dateObject.getTime();

    // Iterate over the items
    for (var i = 0; i < cart.itemsArray.length; i++) {
      // get single product
      const product = await Product.findById(cart.itemsArray[i]);
      // its owner
      const owner = await User.findById(product.owner);
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
        console.log(error);
        return res.status(500).json({
          message: "Server error",
        });
      }
      // Getting token
      if (product.origin === "Egypt") {
        console.log(product);
        const requestBody = [
          {
            Package_Serial: 0,
            Description: product.name,
            Total_Weight: 8,
            Service_Type: "Door to door",
            Service: "Next Day",
            Service_Category: "Forward delivery",
            Payment_Type: "Cash-on-Delivery",
            COD_Value: 0,
            Customer_Name: owner.Fname + " " + owner.Lname,
            Customer_Email: owner.email,
            CustomerAddressZipCode: "",
            Customer_ReferenceNumber: owner.phone,
            Mobile_No: owner.phone,
            Building_No: "",
            Street: "",
            Floor_No: "",
            Apartment_No: "",
            City: address.city,
            Neighborhood: "",
            District: "",
            Address_Category: "",
            Reference: "string",
            Reference2: "string",
            Country: product.origin,
            CustVal: "",
            Currency: "$",
            GeoLocation: "",
            Pieces: [
              {
                pieceNo: 0,
                Weight: 8,
                ItemCategory: product.category.name,
                SpecialNotes: product.description,
                Dimensions: "",
                PieceReferenceNumber: "",
              },
            ],
            PickupDueDate: "string",
            ServiceDate: "string",
            WarehouseName: "string",
            ValueOfGoods: 0,
            AllowToOpenPackage: true,
            Mobile_No2: "string",
            CompanyName: "string",
          },
        ];

        try {
          // Getting the token
          const responseToken = await axios.post(
            "https://mylerzintegrationtest.mylerz.com/api/Orders/AddOrders?api_key=order",
            requestBody,
            {
              headers: {
                Authorization:
                  "Bearer v5eF6svlZl9ucYj42iZhT-I8onb8qckgva8YBfNd1w4D2FbLFPUBIVO_0x1r7qI7-jtnDkypRRZxzDsyzdoLmb3PGxtxz9ZqjX6auPYbaNk-EQ320PpCFI8dCXZT6U8Odf59Ab6I5nKTRT4bFIjkzON8d3MPVjy6YWcWA3gZYIIpWkmb2UjkRS4IQU009iC29iV7kqso7rNYsoRgWsQ7RHsECHaUKLrU_mwHGAW_VVS2M0WyrL1DD8DRPcCiXIWSOhoYqV8PtOiBR2Yzw3N8d5r9yLDwxrQc81IHBGmFwVQhAD6XXM20LNLP50NDAmLOnXRRUxhCZssBAWtPrQCRR8Beyyma3vORvLV6WhHvQqUBUMCNpfahxCLNxa-0PwihdgX_Jv7ykNNTte5HLyWaVi8JE38raEjZfVexLS6JjZfRCRYbyNObYXFla5hJaE3ghR0_YbqCm4uTLk8DDtq71BZ2xuec7Igu9kNEF3oow88lCzQ5tNBj1IaINheN88KzmkZLqvRQlH5Jw-0-KFzndIDkIvpC31XACWiIRqU5nP0",
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
      for (let i = 0; i < cart.itemsArray.length; i++) {
        const product = cart.itemsArray[i];
        product.isAvailable = false;
        await product.save()
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

exports.getAllOrders = async (req,res) => {
  try {
    const orders = await Order.find({}).populate({
      path:"cart",
      model: "Cart",
      populate: {
        path: "cartOwner",
        model: "User"
      }
    })
    if(!orders) {
      return res.status(404).json({
        message: "No Orders found"
      })
    }
    res.status(200).json(orders)
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
}