require("dotenv").config();
const app = require("express")();
const fs = require("fs");


// Database Connection
require("./database").connectDB();

// Middleware
app.use(require("express").json({ limit: "50mb" }));
app.use(require("body-parser").json());
app.use(require("body-parser").urlencoded({ extended: false, limit: "50mb" }));
app.use(require("cors")());

// Routes
app.use("/api/user/auth", require("./routes/User/UserAuthRoute"));
app.use("/api/user/auth/emoud", require("./routes/User/EmoudAuthRoute"));
app.use("/api/user/address", require("./routes/Address/AddressRoute"));
app.use("/api/products", require("./routes/Product/ProductRoute"));
app.use("/api/order", require("./routes/Order/OrderRoute"));
app.use("/api/category", require("./routes/Category/CategoryRoute"));
app.use("/api", require("./routes/Cart/CartRoute"));


// // TRY AI
// const buffer = fs.readFileSync('./iPhone-SE-2022-Starlight-Back-in-Hand.jpg');
// // Convert the buffer to a base64 string
// const base64Image = buffer.toString("base64");
// require('./helpers/googleVision').performLabelDetection([base64Image])


const PORT = process.env.PORT || 3306;
app.listen(PORT, () => {
  // require('./models/Category/CategoryModel').insertMany(require('./config/categories').categoryNames)
  console.log(`server is running at http://localhost:${PORT}`);
});

// INSERT CATEGORIES
// require('./models/Category/CategoryModel').insertMany(require('./config/categories').categoryNames)
