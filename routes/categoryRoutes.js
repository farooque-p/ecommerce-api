import express from "express";
import { isAdmin, isAuthenticated } from "../middleware/authenticatedUser.js";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

// Create Category
router.post("/create", isAuthenticated, isAdmin, createCategory);

// Get All Categories
router.get("/get-all", getAllCategories);

// Delete Category
router.delete("/delete/:id", isAuthenticated, isAdmin, deleteCategory);

// Update Category
router.put("/update/:id", isAuthenticated, isAdmin, updateCategory);

export default router;
