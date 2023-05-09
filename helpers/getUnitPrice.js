exports.getUnitPrice = (city) => {
  let unitPrice;

  if (city === "Tunisia") {
    unitPrice = "TND";
  } else if (city === "Morocco") {
    unitPrice = "MAD";
  } else if (city === "Algeria") {
    unitPrice = "DZD";
  } else if (city === "Senegal") {
    unitPrice = "XOF";
  } else if (city === "Côte d'Ivoire") {
    unitPrice = "XOF";
  } else if (city === "Benin") {
    unitPrice = "XOF";
  } else if (city === "Lebanon") {
    unitPrice = "dollar";
  } else if (city === "Egypt") {
    unitPrice = "EGP";
  } else {
    return "dollar";
  }
  return unitPrice;
};
