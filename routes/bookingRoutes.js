import express from "express";
import { createBooking, getAllBookings } from "../controllers/bookingController.js";

const router = express.Router();

// POST - Save booking
router.post("/", createBooking);

// GET - Fetch all bookings (for admin)
router.get("/", getAllBookings);

export default router;
