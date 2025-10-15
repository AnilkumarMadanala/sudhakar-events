import Booking from "../models/bookingmodel.js";

// Existing createBooking function
export const createBooking = async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({ message: "Booking submitted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error saving booking", error });
  }
};

// 🆕 Add this function
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error });
  }
};
