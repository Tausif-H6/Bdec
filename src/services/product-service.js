const { Op } = require("sequelize");
const productRepository = require("../repositories/product-repository");

class ProductService {
  async getAllProducts(query = {}) {
    try {
      const filter = {};

      // Apply filters if provided
      if (query.categoryId) {
        filter.nCategoryCode = query.categoryId;
      }

      if (query.active !== undefined) {
        filter.bActive = query.active === "true";
      }

      if (query.search) {
        filter.strItemDesc = {
          [Op.like]: `%${query.search}%`,
        };
      }

      // Pagination parameters with defaults
      const page = parseInt(query.page) || 1;
      const limit = parseInt(query.per_page) || 25;

      // Validate pagination parameters
      if (page < 1) {
        return {
          status: 400,
          message: "Page must be greater than 0",
          data: null,
        };
      }

      if (limit < 1 || limit > 100) {
        return {
          status: 400,
          message: "Per page must be between 1 and 100",
          data: null,
        };
      }

      // Get paginated results
      const paginatedResult = await productRepository.findAllWithPagination(
        filter,
        page,
        limit
      );

      // Calculate metadata
      const total = paginatedResult.total;
      const thisPage = paginatedResult.data.length;
      const lastPage = page >= paginatedResult.totalPages;

      const meta = {
        total: total,
        page: page.toString(),
        per_page: limit.toString(),
        this_page: thisPage,
        last_page: lastPage,
        total_pages: paginatedResult.totalPages,
        has_next: page < paginatedResult.totalPages,
        has_previous: page > 1,
      };

      return {
        status: 200,
        message: "Products retrieved successfully",
        meta: meta,
        data: paginatedResult.data,
      };
    } catch (error) {
      throw new Error(`Failed to retrieve products: ${error.message}`);
    }
  }

  async getProductById(id) {
    try {
      const product = await productRepository.findById(id);

      if (!product) {
        return {
          status: 404,
          message: "Product not found",
          data: null,
        };
      }

      // Format response
      const formattedProduct = {
        strItemDesc: product.strItemDesc,
        nSkuCode: product.nSkuCode,
        nItemCode: product.nItemCode,
        nCategoryCode: product.nCategoryCode,
        nPackQty: product.nPackQty,
        UOM: product.UOM,
        strSize: product.strSize,
        strRemarks: product.strRemarks,
        isClimate: product.isClimate,
        ftAvgCost: product.ftAvgCost,
        ftUnitPrice: product.ftUnitPrice,
        ftDiscount: product.ftDiscount,
        bActive: product.bActive,
        isDiscount: product.isDiscount,
        bMultiPrice: product.bMultiPrice,
        isGST: product.isGST,
        IsTax: product.IsTax,
        image64string: product.image64string, // Base64 image
        bOpen: product.bOpen,
        bKitchenShow: product.bKitchenShow,
        strFullItemDesc: product.strFullItemDesc,
        isQrActive: product.isQrActive,
        strImageLoc: product.strImageLoc, // Image URL or path
        ftSecUnitPrice: product.ftSecUnitPrice,
        multiPrice: [], // Will be populated later
        condiments: [], // Will be populated later
        category: product.category,
        bQR: product.bQR,
        bCombo: product.bCombo,
        bCondiments: product.bCondiments,
      };

      return {
        status: 200,
        message: "Product retrieved successfully",
        data: formattedProduct,
      };
    } catch (error) {
      throw new Error(`Failed to retrieve product: ${error.message}`);
    }
  }

  async createProduct(productData, userId) {
    try {
      // First, check if table exists
      const tableExists = await productRepository.checkTableExists();

      if (!tableExists) {
        console.log("Product table doesn't exist. Creating first product...");
        // Skip SKU check for the first product
      } else {
        // Only check SKU if table exists
        const skuExists = await productRepository.checkSkuExists(
          productData.nSkuCode
        );
        if (skuExists) {
          return {
            status: 400,
            message: "SKU code already exists",
            data: null,
          };
        }
      }

      // Add createdBy user
      productData.createdBy = userId;

      const newProduct = await productRepository.create(productData);

      return {
        status: 201,
        message: "Product created successfully",
        data: newProduct,
      };
    } catch (error) {
      console.error("Error creating product:", error);
      throw new Error(`Failed to create product: ${error.message}`);
    }
  }

  async updateProduct(id, productData, userId) {
    try {
      // Check if product exists
      const existingProduct = await productRepository.findById(id);
      if (!existingProduct) {
        return {
          status: 404,
          message: "Product not found",
          data: null,
        };
      }

      // Check if SKU code is being changed and already exists
      if (
        productData.nSkuCode &&
        productData.nSkuCode !== existingProduct.nSkuCode
      ) {
        const skuExists = await productRepository.checkSkuExists(
          productData.nSkuCode,
          id
        );
        if (skuExists) {
          return {
            status: 400,
            message: "SKU code already exists",
            data: null,
          };
        }
      }

      // Add updatedBy user
      productData.updatedBy = userId;

      const updatedProduct = await productRepository.update(id, productData);

      return {
        status: 200,
        message: "Product updated successfully",
        data: updatedProduct,
      };
    } catch (error) {
      console.error("Error updating product:", error);
      throw new Error(`Failed to update product: ${error.message}`);
    }
  }

  async deleteProduct(id) {
    try {
      const product = await productRepository.findById(id);
      if (!product) {
        return {
          status: 404,
          message: "Product not found",
          data: null,
        };
      }

      await productRepository.delete(id);

      return {
        status: 200,
        message: "Product deleted successfully",
        data: null,
      };
    } catch (error) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  }

  async toggleProductStatus(id, status) {
    try {
      const product = await productRepository.findById(id);
      if (!product) {
        return {
          status: 404,
          message: "Product not found",
          data: null,
        };
      }

      const updatedProduct = await productRepository.updateStatus(id, status);

      return {
        status: 200,
        message: `Product ${status ? "activated" : "deactivated"} successfully`,
        data: updatedProduct,
      };
    } catch (error) {
      throw new Error(`Failed to update product status: ${error.message}`);
    }
  }

  async getProductsByCategory(categoryId) {
    try {
      const products = await productRepository.getByCategory(categoryId);

      return {
        status: 200,
        message: "Products retrieved successfully",
        data: products,
      };
    } catch (error) {
      throw new Error(
        `Failed to retrieve products by category: ${error.message}`
      );
    }
  }
}

module.exports = new ProductService();
