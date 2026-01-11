const express = require("express");
const router = express.Router();
const productController = require("../controllers/product-controller");
const authMiddleware = require("../middleware");
const uploadErrorHandler = require("../utils/uploadErrorHandler");

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
// Image-specific routes
router.put(
  "/:id/upload-image",
  authMiddleware,
  uploadErrorHandler,
  productController.updateProductImageUrl
);

router.delete(
  "/:id/image",
  authMiddleware,
  productController.deleteProductImage
);

module.exports = router;
