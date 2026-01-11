const productService = require("../services/product-service");
const ImageUtils = require("../utils/imageUtils");

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
      const userId = req.user?.id || null;

      // Handle image if provided in strImageLoc
      if (productData.strImageLoc) {
        const imageInfo = ImageUtils.parseImageLoc(productData.strImageLoc);

        if (imageInfo && imageInfo.type === "base64") {
          // Save base64 image and update strImageLoc with URL
          const savedImage = await ImageUtils.saveBase64Image(
            imageInfo.data,
            "temp"
          );
          if (savedImage) {
            productData.strImageLoc = ImageUtils.generateImageUrl(
              savedImage.filename,
              req
            );
          }
        }
      }

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

      // Handle image if provided in strImageLoc
      if (productData.strImageLoc) {
        const imageInfo = ImageUtils.parseImageLoc(productData.strImageLoc);

        if (imageInfo && imageInfo.type === "base64") {
          // Get existing product to delete old image
          const existingProduct = await productService.getProductById(id);
          if (existingProduct.data && existingProduct.data.strImageLoc) {
            const oldImageInfo = ImageUtils.parseImageLoc(
              existingProduct.data.strImageLoc
            );
            if (oldImageInfo && oldImageInfo.filename) {
              await ImageUtils.deleteImage(oldImageInfo.filename);
            }
          }

          // Save new base64 image
          const savedImage = await ImageUtils.saveBase64Image(
            imageInfo.data,
            id
          );
          if (savedImage) {
            productData.strImageLoc = ImageUtils.generateImageUrl(
              savedImage.filename,
              req
            );
          }
        }
      }

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

      // Get product to delete its image
      const product = await productService.getProductById(id);
      if (product.data && product.data.strImageLoc) {
        const imageInfo = ImageUtils.parseImageLoc(product.data.strImageLoc);
        if (imageInfo && imageInfo.filename) {
          await ImageUtils.deleteImage(imageInfo.filename);
        }
      }

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
  async updateProductImageUrl(req, res) {
    try {
      const { id } = req.params;
      const { strImageLoc, image64string } = req.body;

      if (!strImageLoc && !image64string) {
        return res.status(400).json({
          status: 400,
          message: "Either strImageLoc or image64string is required",
          data: null,
        });
      }

      // Get existing product
      const existingProduct = await productService.getProductById(id);
      if (!existingProduct.data) {
        return res.status(404).json({
          status: 404,
          message: "Product not found",
          data: null,
        });
      }

      const updateData = {
        updatedBy: req.user?.id || null,
      };

      // Handle base64 image
      if (image64string) {
        // Delete old image if exists
        if (existingProduct.data.strImageLoc) {
          const oldImageInfo = ImageUtils.parseImageLoc(
            existingProduct.data.strImageLoc
          );
          if (oldImageInfo && oldImageInfo.filename) {
            await ImageUtils.deleteImage(oldImageInfo.filename);
          }
        }

        // Save base64 image
        const savedImage = await ImageUtils.saveBase64Image(image64string, id);
        if (savedImage) {
          updateData.strImageLoc = ImageUtils.generateImageUrl(
            savedImage.filename,
            req
          );
          updateData.image64string = image64string;
        }
      } else if (strImageLoc) {
        // Direct URL or path
        updateData.strImageLoc = strImageLoc;

        // If it's a base64 string in strImageLoc
        const imageInfo = ImageUtils.parseImageLoc(strImageLoc);
        if (imageInfo && imageInfo.type === "base64") {
          // Delete old image if exists
          if (existingProduct.data.strImageLoc) {
            const oldImageInfo = ImageUtils.parseImageLoc(
              existingProduct.data.strImageLoc
            );
            if (oldImageInfo && oldImageInfo.filename) {
              await ImageUtils.deleteImage(oldImageInfo.filename);
            }
          }

          // Save base64 image
          const savedImage = await ImageUtils.saveBase64Image(strImageLoc, id);
          if (savedImage) {
            updateData.strImageLoc = ImageUtils.generateImageUrl(
              savedImage.filename,
              req
            );
            updateData.image64string = strImageLoc;
          }
        }
      }

      const result = await productService.updateProduct(
        id,
        updateData,
        req.user?.id
      );
      res.status(result.status).json(result);
    } catch (error) {
      console.error("Error updating product image:", error);
      res.status(500).json({
        status: 500,
        message: error.message,
        data: null,
      });
    }
  }
  // NEW: Delete product image
  async deleteProductImage(req, res) {
    try {
      const { id } = req.params;

      // Get existing product
      const existingProduct = await productService.getProductById(id);
      if (!existingProduct.data) {
        return res.status(404).json({
          status: 404,
          message: "Product not found",
          data: null,
        });
      }

      // Delete image file
      if (existingProduct.data.strImageLoc) {
        const imageInfo = ImageUtils.parseImageLoc(
          existingProduct.data.strImageLoc
        );
        if (imageInfo && imageInfo.filename) {
          await ImageUtils.deleteImage(imageInfo.filename);
        }
      }

      // Update product to remove image reference
      const updateData = {
        strImageLoc: null,
        image64string: null,
        updatedBy: req.user?.id || null,
      };

      const result = await productService.updateProduct(
        id,
        updateData,
        req.user?.id
      );
      res.status(result.status).json(result);
    } catch (error) {
      console.error("Error deleting product image:", error);
      res.status(500).json({
        status: 500,
        message: error.message,
        data: null,
      });
    }
  }
  // NEW: Get product image
  async getProductImage(req, res) {
    try {
      const { id } = req.params;

      const product = await productService.getProductById(id);
      if (!product.data) {
        return res.status(404).json({
          status: 404,
          message: "Product not found",
          data: null,
        });
      }

      if (!product.data.strImageLoc) {
        return res.status(404).json({
          status: 404,
          message: "Product does not have an image",
          data: null,
        });
      }

      const imageInfo = ImageUtils.parseImageLoc(product.data.strImageLoc);
      if (!imageInfo || !imageInfo.filename) {
        return res.status(404).json({
          status: 404,
          message: "Image file not found",
          data: null,
        });
      }

      const imagePath = path.join(
        __dirname,
        "../uploads/products",
        imageInfo.filename
      );

      if (!(await fs.pathExists(imagePath))) {
        return res.status(404).json({
          status: 404,
          message: "Image file not found on server",
          data: null,
        });
      }

      // Send image file
      res.sendFile(imagePath);
    } catch (error) {
      console.error("Error getting product image:", error);
      res.status(500).json({
        status: 500,
        message: error.message,
        data: null,
      });
    }
  }
}

module.exports = new ProductController();
