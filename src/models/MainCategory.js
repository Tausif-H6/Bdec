const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class MainCategory extends Model {}

MainCategory.init(
  {
    nMainCategory: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    strMainCategoryName: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    bActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    nPosition: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    bPanelKiosk: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "MainCategory",
    tableName: "tblmaincategory",
  }
);

module.exports = MainCategory;
