const categoryRepo = require("../repositories/category-repositories");
const mainCategoryRepo = require("../repositories/mainCategory-repository");
const { fn, col } = require("sequelize");

class CategoryService {
  async getAll(mainCategoryId = null) {
    const where = { bActive: true };
    if (mainCategoryId) where.nMainCategory = mainCategoryId;
    return categoryRepo.findAll(where);
  }

  async getById(id) {
    const cat = await categoryRepo.findById(id);
    if (!cat || !cat.bActive) throw new Error("Category not found");
    return cat;
  }

  async create(data) {
    if (!data.strCategoryDesc?.trim())
      throw new Error("strCategoryDesc is required");

    // Extract nMainCategory ID robustly (handle object or number)
    let mainCategoryId = data.nMainCategory;
    if (typeof mainCategoryId === "object" && mainCategoryId !== null) {
      mainCategoryId =
        mainCategoryId.nMainCategory ||
        mainCategoryId.id ||
        mainCategoryId.value; // common object shapes
    }
    if (!mainCategoryId || isNaN(Number(mainCategoryId))) {
      throw new Error("Valid nMainCategory ID is required");
    }
    mainCategoryId = Number(mainCategoryId);

    // Validate MainCategory exists
    const main = await mainCategoryRepo.findById(mainCategoryId);
    if (!main) throw new Error("MainCategory not found");

    // Prevent manual primary key
    if (data.nCategoryID !== undefined) {
      throw new Error("Do not provide nCategoryID – it is auto-generated");
    }

    // Clean up – ensure only ID is set (remove any object)
    data.nMainCategory = mainCategoryId;
    delete data.mainCategory; // if frontend sends associated object under "mainCategory"

    // Auto position if not provided
    if (!data.cPosition) {
      data.cPosition = await categoryRepo.getNextPosition(mainCategoryId);
    }

    return categoryRepo.create(data);
  }

  async update(id, data) {
    return categoryRepo.update(id, data);
  }

  async delete(id) {
    return categoryRepo.delete(id);
  }
}

module.exports = new CategoryService();
