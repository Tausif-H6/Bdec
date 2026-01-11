const productService = require("../services/product-service");

class ProductController {
  async getAllProducts(req, res) {
    try {
      const result = await productService.getAllProducts(req.query);
      res.status(result.status).json(result);
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message,
        data: null,
      });
    }
  }

  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const result = await productService.getProductById(id);
      res.status(result.status).json(result);
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message,
        data: null,
      });
    }
  }

  async createProduct(req, res) {
    try {
      const productData = req.body;
      const userId = req.user?.id || null; // Assuming you have user info in req.user

      const result = await productService.createProduct(productData, userId);
      res.status(result.status).json(result);
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message,
        data: null,
      });
    }
  }

  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const productData = req.body;
      const userId = req.user?.id || null;

      const result = await productService.updateProduct(
        id,
        productData,
        userId
      );
      res.status(result.status).json(result);
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message,
        data: null,
      });
    }
  }

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const result = await productService.deleteProduct(id);
      res.status(result.status).json(result);
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message,
        data: null,
      });
    }
  }

  async toggleProductStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const result = await productService.toggleProductStatus(id, status);
      res.status(result.status).json(result);
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message,
        data: null,
      });
    }
  }

  async getProductsByCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const result = await productService.getProductsByCategory(categoryId);
      res.status(result.status).json(result);
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message,
        data: null,
      });
    }
  }
}

module.exports = new ProductController();
