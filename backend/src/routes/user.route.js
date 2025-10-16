import express from "express";
import {
  followUser,
  getCurrentUser,
  getUserProfile,
  syncUser,
  updateProfile,
} from "../controllers/user.controller";
import { protectRoute } from "../middleware/auth.middleware";
const router = express.Router();

// public routes
router.get("/profile/:username", getUserProfile);

// protected routes
router.post("/sync", protectRoute, syncUser);
router.post("/me", protectRoute, getCurrentUser);
router.put("/profile", protectRoute, updateProfile);
router.post("/follow/:targetUserId", protectRoute, followUser);

export default router;
