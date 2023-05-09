exports.getUnitPrice = (city) => {
  let symbol;

  if (city === "Tunisia") {
    symbol = "TND";
  } else if (city === "Morocco") {
    symbol = "MAD";
  } else if (city === "Algeria") {
    symbol = "DZD";
  } else if (city === "Senegal" || city === "Côte d'Ivoire" || city === "Benin") {
    symbol = "XOF";
  } else if (city === "Lebanon") {
    symbol = "$"; // dollar symbol
  } else if (city === "Egypt") {
    symbol = "EGP";
  } else {
    symbol = "$"; // default to dollar symbol
  }

  // Return the symbol
  switch (symbol) {
    case "TND":
      return "د.ت"; // Tunisian Dinar symbol
    case "MAD":
      return "د.م."; // Moroccan Dirham symbol
    case "DZD":
      return "د.ج"; // Algerian Dinar symbol
    case "XOF":
      return "CFA"; // West African CFA Franc symbol
    case "EGP":
      return "E£"; // Egyptian Pound symbol
    default:
      return "$"; // default to dollar symbol
  }
};
