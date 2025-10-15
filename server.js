import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bookingRoutes from "./routes/bookingRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { protect } from "./middleware/authMiddleware.js";
import Booking from "./models/bookingmodel.js"; // ✅ make sure "M" is uppercase and matches the file name exactly

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB (only once)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

// ✅ Protected admin route to fetch bookings
app.get("/api/admin/bookings", protect, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error("❌ Error fetching bookings:", error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

// ✅ Start server after DB connection
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
