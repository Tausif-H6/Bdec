const MainCategory = require("../models/MainCategory"); // Match your model filename exactly
const Category = require("../models/Category");
const { fn, col } = require("sequelize"); // Static import for aggregates

class MainCategoryRepository {
  async findAll() {
    return MainCategory.findAll({
      order: [["nPosition", "ASC"]],
      include: [
        {
          model: Category,
          as: "categories",
          required: false,
        },
      ],
    });
  }

  async findById(id) {
    return MainCategory.findByPk(id, {
      include: [
        {
          model: Category,
          as: "categories",
          required: false,
        },
      ],
    });
  }

  async create(data) {
    // Correct: Just create using the model
    return MainCategory.create(data);
  }

  async update(id, data) {
    const record = await MainCategory.findByPk(id);
    if (!record) throw new Error("MainCategory not found");
    return record.update(data);
  }

  // Changed to HARD DELETE (permanent removal)
  async delete(id) {
    const record = await MainCategory.findByPk(id);
    if (!record) throw new Error("MainCategory not found");
    await record.destroy(); // Permanent delete
    return { success: true }; // Optional return for clarity
  }

  async getNextPosition() {
    const result = await MainCategory.findOne({
      attributes: [[fn("MAX", col("nPosition")), "maxPos"]],
    });
    const maxPos = result ? result.get("maxPos") : null;
    return (maxPos ?? 0) + 1;
  }
}

module.exports = new MainCategoryRepository();
