import express from "express";
import {
  createProduct,
  deleteProduct,
  deleteProductImage,
  getAllProducts,
  getSingleProduct,
  getTopProduct,
  reviewProduct,
  updateProduct,
  updateProductImage,
} from "../controllers/productController.js";
import { isAdmin, isAuthenticated } from "../middleware/authenticatedUser.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

// Routes

//Create Product
router.post("/create", singleUpload, isAuthenticated, isAdmin, createProduct);

//Get All Products
router.get("/all", getAllProducts);

//Get Top Products
router.get("/top", getTopProduct);

//Get Single Product
router.get("/:id", getSingleProduct);

// Update Product
router.put("/:id", isAuthenticated, isAdmin, updateProduct);

// Update Product Image
router.put(
  "/image/:id",
  isAuthenticated,
  isAdmin,
  singleUpload,
  updateProductImage
);

// Delete Product Image
router.delete(
  "/image-delete/:id",
  isAuthenticated,
  isAdmin,
  deleteProductImage
);

// Delete Product
router.delete("/delete/:id", isAuthenticated, isAdmin, deleteProduct);

// Review Product
router.put("/:id/review", isAuthenticated, reviewProduct);

export default router;
