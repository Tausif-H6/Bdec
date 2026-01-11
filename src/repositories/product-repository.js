const { Category, Product } = require("../models");

const { Op } = require("sequelize");

class ProductRepository {
  async checkTableExists() {
    try {
      // Try to query the table to see if it exists
      await Product.findOne({ limit: 1 });
      return true;
    } catch (error) {
      // If table doesn't exist, error will be thrown
      if (
        error.name === "SequelizeDatabaseError" &&
        error.message.includes("doesn't exist")
      ) {
        return false;
      }
      throw error;
    }
  }

  async findAllWithPagination(filter = {}, page = 1, limit = 25) {
    try {
      const offset = (page - 1) * limit;

      const result = await Product.findAndCountAll({
        where: filter,
        include: [
          {
            model: Category,
            as: "category",
            attributes: ["nCategoryID", "strCategoryDesc", "bActive"],
          },
        ],
        order: [["strItemDesc", "ASC"]],
        limit: parseInt(limit),
        offset: offset,
        distinct: true, // Important for count with includes
      });

      return {
        data: result.rows,
        total: result.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(result.count / limit),
      };
    } catch (error) {
      console.error("Error in findAllWithPagination:", error);
      throw new Error(
        `Database error in findAllWithPagination: ${error.message}`
      );
    }
  }

  async findById(id) {
    try {
      const tableExists = await this.checkTableExists();
      if (!tableExists) {
        return null;
      }

      return await Product.findByPk(id, {
        include: [
          {
            model: Category,
            as: "category",
            attributes: ["nCategoryID", "strCategoryDesc", "bActive"],
          },
        ],
      });
    } catch (error) {
      if (
        error.name === "SequelizeDatabaseError" &&
        error.message.includes("doesn't exist")
      ) {
        return null;
      }
      throw new Error(`Database error in findById: ${error.message}`);
    }
  }

  async findBySkuCode(skuCode) {
    try {
      const tableExists = await this.checkTableExists();
      if (!tableExists) {
        return null;
      }

      return await Product.findOne({
        where: { nSkuCode: skuCode },
        include: [
          {
            model: Category,
            as: "category",
          },
        ],
      });
    } catch (error) {
      if (
        error.name === "SequelizeDatabaseError" &&
        error.message.includes("doesn't exist")
      ) {
        return null;
      }
      throw new Error(`Database error in findBySkuCode: ${error.message}`);
    }
  }

  async create(productData) {
    try {
      const tableExists = await this.checkTableExists();
      if (!tableExists) {
        // Create table first
        await Product.sync({ force: false });
      }

      return await Product.create(productData);
    } catch (error) {
      throw new Error(`Database error in create: ${error.message}`);
    }
  }

  async update(id, productData) {
    try {
      const tableExists = await this.checkTableExists();
      if (!tableExists) {
        throw new Error("Product table does not exist");
      }

      const product = await Product.findByPk(id);
      if (!product) return null;

      return await product.update(productData);
    } catch (error) {
      throw new Error(`Database error in update: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const tableExists = await this.checkTableExists();
      if (!tableExists) {
        throw new Error("Product table does not exist");
      }

      const product = await Product.findByPk(id);
      if (!product) return null;

      return await product.destroy();
    } catch (error) {
      throw new Error(`Database error in delete: ${error.message}`);
    }
  }

  async updateStatus(id, status) {
    try {
      const tableExists = await this.checkTableExists();
      if (!tableExists) {
        throw new Error("Product table does not exist");
      }

      const product = await Product.findByPk(id);
      if (!product) return null;

      return await product.update({ bActive: status });
    } catch (error) {
      throw new Error(`Database error in updateStatus: ${error.message}`);
    }
  }

  async getByCategory(categoryId) {
    try {
      const tableExists = await this.checkTableExists();
      if (!tableExists) {
        return [];
      }

      return await Product.findAll({
        where: {
          nCategoryCode: categoryId,
          bActive: true,
        },
        include: [
          {
            model: Category,
            as: "category",
          },
        ],
        order: [["strItemDesc", "ASC"]],
      });
    } catch (error) {
      if (
        error.name === "SequelizeDatabaseError" &&
        error.message.includes("doesn't exist")
      ) {
        return [];
      }
      throw new Error(`Database error in getByCategory: ${error.message}`);
    }
  }

  async checkSkuExists(skuCode, excludeId = null) {
    try {
      const tableExists = await this.checkTableExists();
      if (!tableExists) {
        return false; // Table doesn't exist, so SKU can't exist
      }

      const whereCondition = { nSkuCode: skuCode };

      if (excludeId) {
        whereCondition.nItemCode = { [Op.ne]: excludeId };
      }

      const product = await Product.findOne({
        where: whereCondition,
      });

      return !!product;
    } catch (error) {
      // If table doesn't exist, SKU doesn't exist
      if (
        error.name === "SequelizeDatabaseError" &&
        error.message.includes("doesn't exist")
      ) {
        return false;
      }
      throw new Error(`Database error in checkSkuExists: ${error.message}`);
    }
  }
}

module.exports = new ProductRepository();
