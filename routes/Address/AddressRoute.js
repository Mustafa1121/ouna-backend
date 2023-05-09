const router = require("express").Router();
const controller = require("../../controller/Address/AddressController");

// POST (ADDRESS)
router.post("/", controller.createAddress);
// GET (/)
router.get("/", controller.getAddress);
// GET (/:ID)
router.get("/:id", controller.getAddressById);
// PATCH (/:ID)
router.patch("/:id", controller.updateAddressById);
// DELETE (:/ID)
router.delete(":id", controller.deleteAddressById);

module.exports = router;
