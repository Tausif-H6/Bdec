const Category = require("../models/Category");
const MainCategory = require("../models/MainCategory");
const { fn, col } = require("sequelize"); // Static import – no instance needed

class CategoryRepository {
  // Removed default bActive filter → caller decides (consistent with MainCategory)
  async findAll(where = {}) {
    return Category.findAll({
      where,
      order: [["cPosition", "ASC"]],
      include: [{ model: MainCategory, as: "mainCategory" }],
    });
  }

  async findById(id) {
    return Category.findByPk(id, {
      include: [{ model: MainCategory, as: "mainCategory" }],
    });
  }

  async create(data) {
    return Category.create(data);
  }

  async update(id, data) {
    const record = await Category.findByPk(id);
    if (!record) throw new Error("Category not found");
    return record.update(data);
  }

  // Changed to HARD DELETE (permanent) to match MainCategory
  async delete(id) {
    const record = await Category.findByPk(id);
    if (!record) throw new Error("Category not found");
    await record.destroy();
    return { success: true };
  }

  // Added: Get next position within a specific MainCategory
  async getNextPosition(mainCategoryId) {
    const result = await Category.findOne({
      where: { nMainCategory: mainCategoryId },
      attributes: [[fn("MAX", col("cPosition")), "maxPos"]],
    });
    const maxPos = result ? result.get("maxPos") : null;
    return (maxPos ?? 0) + 1;
  }
}

module.exports = new CategoryRepository();
