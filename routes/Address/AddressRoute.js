const router = require("express").Router();
const controller = require("../../controller/Address/AddressController");

// AUTH Middleware
const isAuth = require("../../middleware/User/isAuthMiddleware");
const isVerified = require("../../middleware/User/isVerifiedMiddleware");

// POST (ADDRESS)
router.post("/", isAuth, isVerified, controller.createAddress);
// GET (/)
router.get("/", isAuth, isVerified, controller.getAddress);
// GET (/:ID)
router.get("/:id", isAuth, isVerified, controller.getAddressById);
// PATCH (/:ID)
router.patch("/:id", isAuth, isVerified, controller.updateAddressById);
// DELETE (:/ID)
router.delete("/:id", isAuth, isVerified, controller.deleteAddressById);

module.exports = router;
