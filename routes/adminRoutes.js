import express from "express";
import { loginAdmin,} from "../controllers/adminController.js";
const router = express.Router();

// Admin routes
router.post("/login", loginAdmin);

export default router;
