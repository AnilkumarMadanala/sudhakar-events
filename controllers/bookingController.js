import Booking from "../models/bookingmodel.js";
import sgMail from "@sendgrid/mail";

// ✅ Create a new booking
export const createBooking = async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();

    // ✅ Setup SendGrid
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log("Sending emails via SendGrid...");

    const customerMail = {
      to: booking.email,
      from: {
        email: process.env.EMAIL_USER,
        name: "Event Booking Team",
      },
      subject: "Booking Confirmation - Thank you!",
      html: `
        <h2>Thank you for your booking, ${booking.fullName}!</h2>
        <p>We have received your booking for <b>${booking.eventType}</b> on <b>${new Date(
          booking.date
        ).toDateString()}</b>.</p>
        <p>Venue: ${booking.venue}</p>
        <p>We will contact you soon for further details.</p>
        <br>
        <p>Best regards,<br>Event Team</p>
      `,
    };

    const adminMail = {
      to: process.env.ADMIN_EMAIL,
      from: {
        email: process.env.EMAIL_USER,
        name: "Event Booking System",
      },
      subject: `New Booking from ${booking.fullName}`,
      html: `
        <h3>New Booking Details:</h3>
        <p><b>Name:</b> ${booking.fullName}</p>
        <p><b>Email:</b> ${booking.email}</p>
        <p><b>Phone:</b> ${booking.phone}</p>
        <p><b>Event Type:</b> ${booking.eventType}</p>
        <p><b>Date:</b> ${new Date(booking.date).toDateString()}</p>
        <p><b>Venue:</b> ${booking.venue}</p>
        <p><b>Details:</b> ${booking.details || "N/A"}</p>
      `,
    };

    // ✅ Send both emails
    await Promise.all([
      sgMail
        .send(customerMail)
        .then(() => console.log("Customer email sent"))
        .catch((err) => {
          console.error("Customer email error:", err.response?.body || err);
        }),
      sgMail
        .send(adminMail)
        .then(() => console.log("Admin email sent"))
        .catch((err) => {
          console.error("Admin email error:", err.response?.body || err);
        }),
    ]);

    res.status(201).json({
      message: "Booking submitted successfully!",
    });
  } catch (error) {
    console.error("Booking error:", error.message);
    res.status(500).json({
      message: "Error processing booking",
      error: error.message,
    });
  }
};

// ✅ Get all bookings (for admin)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error.message);
    res.status(500).json({ message: "Error fetching bookings", error });
  }
};
