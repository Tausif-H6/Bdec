const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");
const MainCategory = require("./MainCategory");

class Category extends Model {}

Category.init(
  {
    nCategoryID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    strCategoryDesc: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    nCategoryType: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    bActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    strAbr: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    nLastRun: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    cPosition: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    strPrinter: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    nLeadingZero: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    bCatQR: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    nMainCategory: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bPanel: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    strTimeSlot: {
      type: DataTypes.STRING(50),
      defaultValue: "",
    },
  },
  {
    sequelize,
    modelName: "Category",
    tableName: "tblcategory",
  }
);

Category.belongsTo(MainCategory, {
  foreignKey: "nMainCategory",
  as: "mainCategory",
});

MainCategory.hasMany(Category, {
  foreignKey: "nMainCategory",
  as: "categories",
});

module.exports = Category;
