const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/user-routes");
const authRoutes = require("./routes/auth-routes");
const mainCategoryRoutes = require("./routes/mainCategory-routes");
const categoryRoutes = require("./routes/category-routes");
const productRoutes = require("./routes/product-routes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/main-categories", mainCategoryRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
module.exports = app;
