import express from "express";
import { isAdmin, isAuthenticated } from "../middleware/authenticatedUser.js";
import {
  createOrder,
  getAllOrders,
  getMyOrders,
  getPayment,
  getSingleOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

//Routes
router.post("/create", isAuthenticated, createOrder);

// Get All Orders - User
router.get("/my-orders", isAuthenticated, getMyOrders);

// Get Single Order
router.get("/my-orders/:id", isAuthenticated, getSingleOrder);

//Payments
router.post("/payment", isAuthenticated, getPayment);

// Admin Routes

//Get All Orders
router.get("/admin/get-all-orders", isAuthenticated, isAdmin, getAllOrders);

//Update Order Status
router.put("/admin/order/:id", isAuthenticated, isAdmin, updateOrderStatus);

export default router;
