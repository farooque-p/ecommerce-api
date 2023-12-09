import express from "express";
import {
  getUserProfile,
  login,
  logout,
  register,
  resetPassword,
  updatePassword,
  updateProfilePicture,
  updateUserProfile,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/authenticatedUser.js";
import { singleUpload } from "../middleware/multer.js";
import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Use an external store for consistency across multiple server instances.
});

const router = express.Router();
//Register
router.post("/register", limiter, register);

//Login
router.post("/login", limiter, login);

//Get User Profile
router.get("/profile", isAuthenticated, getUserProfile);

//Logout
router.get("/logout", isAuthenticated, logout);

//Update User Profile
router.put("/update-profile", isAuthenticated, updateUserProfile);

//Update Password
router.put("/update-password", isAuthenticated, updatePassword);

// Update Profile Picture
router.put(
  "/update-profile-picture",
  singleUpload,
  isAuthenticated,
  updateProfilePicture
);

//Update Password
router.post("/reset-password", resetPassword);

export default router;
