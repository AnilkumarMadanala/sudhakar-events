import express from "express";
import { loginAdmin, registerAdmin } from "../controllers/adminController.js";
const router = express.Router();

// Admin routes
router.post("/register", registerAdmin); // Only for setup
router.post("/login", loginAdmin);

export default router;
