require("dotenv").config();
const app = require("express")();

// Database Connection
require("./database").connectDB();

// Middleware
app.use(require("express").json());
app.use(require("body-parser").json());
app.use(require("body-parser").urlencoded({ extended: false, limit: "50mb" }));
app.use(require("cors")());

// Routes

const PORT = process.env.PORT || 3306;
app.listen(PORT, console.log(`server is running at http://localhost:${PORT}`));