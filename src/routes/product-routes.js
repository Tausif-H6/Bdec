const express = require("express");
const router = express.Router();
const productController = require("../controllers/product-controller");
const authMiddleware = require("../middleware");
// Apply authentication middleware to all routes
// router.use(authMiddleware);
// Public routes (if needed)
router.get("/", productController.getAllProducts);
router.get("/category/:categoryId", productController.getProductsByCategory);
router.get("/:id", productController.getProductById);

// Protected routes (require authentication)
router.post("/", authMiddleware, productController.createProduct);
router.put("/:id", authMiddleware, productController.updateProduct);
router.delete("/:id", authMiddleware, productController.deleteProduct);
router.patch(
  "/:id/status",
  authMiddleware,
  productController.toggleProductStatus
);

module.exports = router;
