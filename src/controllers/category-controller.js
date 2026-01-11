const categoryService = require("../services/category-service");

class CategoryController {
  async getAll(req, res) {
    try {
      const mainCategoryId = req.query.mainCategoryId
        ? Number(req.query.mainCategoryId)
        : null;
      const data = await categoryService.getAll(mainCategoryId);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getById(req, res) {
    try {
      const data = await categoryService.getById(req.params.id);
      res.json(data);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

  async create(req, res) {
    try {
      const data = await categoryService.create(req.body);
      res.status(201).json(data);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const data = await categoryService.update(req.params.id, req.body);
      res.json(data);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await categoryService.delete(req.params.id);
      res.status(200).json(result); // { success: true, message: "..." }
    } catch (err) {
      res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  }
}

module.exports = new CategoryController();
