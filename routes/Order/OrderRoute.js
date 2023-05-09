const router = require("express").Router();
const controller = require("../../controller/Order/OrderOperation");

// AUTH Middleware
const isAuth = require("../../middleware/User/isAuthMiddleware");

// Create a new order
router.post("/", isAuth, controller.createOrder);

// Update the status of an existing order
router.patch("/:orderId", isAuth, controller.updateOrderStatus);

module.exports = router;
