const router = require("express").Router();
const controller = require("../../controller/Order/OrderOperation");

// Create a new order
router.post("/", controller.createOrder);

// Update the status of an existing order
router.patch("/:orderId", controller.updateOrderStatus);

module.exports = router;
