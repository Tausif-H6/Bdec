const mainCategoryService = require("../services/mainCategory-service");

class MainCategoryController {
  async getAll(req, res) {
    try {
      const data = await mainCategoryService.getAll();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getById(req, res) {
    try {
      const data = await mainCategoryService.getById(req.params.id);
      res.json(data);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

  async create(req, res) {
    try {
      const data = await mainCategoryService.create(req.body);
      res.status(201).json(data);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const data = await mainCategoryService.update(req.params.id, req.body);
      res.json(data);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      await mainCategoryService.delete(req.params.id);
      // Return 200 OK with success message (instead of 204 empty)
      res.status(200).json({
        success: true,
        message: "MainCategory deleted successfully",
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  }
}

module.exports = new MainCategoryController();
