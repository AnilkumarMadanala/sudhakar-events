import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  eventType: { type: String, required: true },
  date: { type: Date, required: true },
  venue: { type: String, required: true },
  details: { type: String },
});

export default mongoose.model("Booking", bookingSchema);
