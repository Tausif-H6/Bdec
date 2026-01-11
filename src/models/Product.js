const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");
const Category = require("./Category");

class Product extends Model {}

Product.init(
  {
    nItemCode: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    strItemDesc: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    strFullItemDesc: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    nSkuCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    nCategoryCode: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nPackQty: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    UOM: {
      type: DataTypes.STRING(10),
      defaultValue: "1",
    },
    strSize: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    strRemarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isClimate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    ftAvgCost: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    ftUnitPrice: {
      type: DataTypes.DECIMAL(10, 4),
      defaultValue: 0.0,
    },
    ftSecUnitPrice: {
      type: DataTypes.DECIMAL(10, 4),
      defaultValue: 0.0,
    },
    ftDiscount: {
      type: DataTypes.DECIMAL(10, 4),
      defaultValue: 0.0,
    },
    bActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isDiscount: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    bMultiPrice: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    bCombo: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    bCondiments: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isGST: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    IsTax: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    bOpen: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    bKitchenShow: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isQrActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    bQR: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    strImageLoc: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image64string: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "tblproduct",
    timestamps: true,
  }
);

// Define associations
Product.belongsTo(Category, {
  foreignKey: "nCategoryCode", // This must match the column name in Product table
  targetKey: "nCategoryID", // This is the primary key in Category table
  as: "category",
});

Category.hasMany(Product, {
  foreignKey: "nCategoryCode", // Foreign key in Product table
  sourceKey: "nCategoryID", // Primary key in Category table
  as: "products",
});

module.exports = Product;
