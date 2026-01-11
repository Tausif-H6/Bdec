const mainCategoryRepo = require("../repositories/mainCategory-repository");
const categoryRepo = require("../repositories/category-repositories");

class MainCategoryService {
  async getAll() {
    return mainCategoryRepo.findAll();
  }

  async getById(id) {
    const main = await mainCategoryRepo.findById(id);
    if (!main || !main.bActive) throw new Error("MainCategory not found");
    return main;
  }

  async create(data) {
    if (!data.strMainCategoryName?.trim()) {
      throw new Error("strMainCategoryName is required");
    }

    // Prevent manual primary key
    if (data.nMainCategory !== undefined) {
      throw new Error("Do not provide nMainCategory – it is auto-generated");
    }

    // Auto position if not provided
    if (!data.nPosition) {
      data.nPosition = await mainCategoryRepo.getNextPosition();
    }

    return mainCategoryRepo.create(data);
  }

  async update(id, data) {
    return mainCategoryRepo.update(id, data);
  }

  async delete(id) {
    const cats = await categoryRepo.findAll({ nMainCategory: id });
    if (cats.length > 0)
      throw new Error("Cannot delete MainCategory with active sub-categories");
    return mainCategoryRepo.delete(id);
  }
}

module.exports = new MainCategoryService();
