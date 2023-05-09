const router = require("express").Router();
const controller = require("../../controller/Address/AddressController");

// AUTH Middleware
const isAuth = require('../../middleware/User/isAuthMiddleware')

// POST (ADDRESS)
router.post("/", isAuth,controller.createAddress);
// GET (/)
router.get("/", isAuth,controller.getAddress);
// GET (/:ID)
router.get("/:id", isAuth,controller.getAddressById);
// PATCH (/:ID)
router.patch("/:id",isAuth, controller.updateAddressById);
// DELETE (:/ID)
router.delete(":id", isAuth,controller.deleteAddressById);

module.exports = router;
