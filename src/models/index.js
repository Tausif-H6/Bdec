const sequelize = require("../config/database");
const Category = require("./Category");
const MainCategory = require("./MainCategory");
const Product = require("./Product");

const User = require("./User");

const db = {
  sequelize,
  User,
  Category,
  MainCategory,
  Product,
};

module.exports = db;
