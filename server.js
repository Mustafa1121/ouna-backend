require("dotenv").config();
const app = require("express")();

// Database Connection
require("./database").connectDB();

// Middleware
app.use(require("express").json({ limit: "50mb" }));
app.use(require("body-parser").json());
app.use(require("body-parser").urlencoded({ extended: false, limit: "50mb" }));
app.use(require("cors")());

// Routes
app.use("/api/user/auth", require("./routes/User/UserAuthRoute"));
app.use("/api/user/address", require("./routes/Address/AddressRoute"));
app.use("/api/products", require("./routes/Product/ProductRoute"));
app.use("/api/order", require("./routes/Order/OrderRoute"));
app.use("/api/category", require("./routes/Category/CategoryRoute"));
app.use("/api", require("./routes/Cart/CartRoute"));

const vision = require("@google-cloud/vision");
const client = new vision.ImageAnnotatorClient({
  keyFilename: "./ai.json",
});

// Performs label detection on the image file
client
  .labelDetection("./iPhone-SE-2022-Starlight-Back-in-Hand.jpg")
  .then((results) => {
    const labels = results[0].labelAnnotations;

    console.log("Labels:");
    labels.forEach((label) => console.log(label.description));
    //console.log(results);
  })
  .catch((err) => {
    console.error("ERROR:", err);
  });

const PORT = process.env.PORT || 3306;
app.listen(PORT, () => {
  // require('./models/Category/CategoryModel').insertMany(require('./config/categories').categoryNames)
  console.log(`server is running at http://localhost:${PORT}`);
});

// INSERT CATEGORIES
// require('./models/Category/CategoryModel').insertMany(require('./config/categories').categoryNames)
