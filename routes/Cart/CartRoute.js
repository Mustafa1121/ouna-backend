const router = require("express").Router();
const controller = require("../../controller/Cart/CartOperation");

router.get("/cart/items", controller.getCartItems);
router.post("/cart/:itemId", controller.addToCart);
router.delete("/cart/:itemId", controller.deleteFromCart);
router.delete("/cart", controller.clearCart);

module.exports = router;
