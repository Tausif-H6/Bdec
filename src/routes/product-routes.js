const express = require("express");
const router = express.Router();
const productController = require("../controllers/product-controller");
const authMiddleware = require("../middleware");
// Apply authentication middleware to all routes
// router.use(authMiddleware);
// Public routes (if needed)
router.get("/", productController.getAllProducts);

// Protected routes (require authentication)
router.get("/:id", authMiddleware, productController.getProductById);
router.post("/", authMiddleware, productController.createProduct);
router.put("/:id", authMiddleware, productController.updateProduct);
router.delete("/:id", authMiddleware, productController.deleteProduct);
router.patch(
  "/:id/status",
  authMiddleware,
  productController.toggleProductStatus
);
router.get(
  "/category/:categoryId",
  authMiddleware,
  productController.getProductsByCategory
);

module.exports = router;
