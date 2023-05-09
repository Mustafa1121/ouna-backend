const Address = require("../../models/Address/AddressModel");

exports.createAddress = async (req, res) => {
  try {
    const address = new Address({
      addressOwner: req.user._id,
      city: req.body.city,
      fullAddress: req.body.fullAddress,
      additionalAddressInfo: req.body.additionalAddressInfo,
    });
    const newAddress = await address.save();
    res.status(201).json(newAddress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAddress = async (req, res) => {
  try {
    const addresses = await Address.find({ addressOwner: req.user._id });
    if (!addresses)
      return res.json({
        message: "No Addresses Found",
      });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAddressById = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      addressOwner: req.user._id,
    });
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAddressById = async (req, res) => {
  try {
    const address = await Address.findOneAndUpdate(
      {
        _id: req.params.id,
        addressOwner: req.user._id,
      },
      {
        city: req.body.city,
        fullAddress: req.body.fullAddress,
        additionalAddressInfo: req.body.additionalAddressInfo,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAddressById = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      addressOwner: req.user._id,
    });
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
