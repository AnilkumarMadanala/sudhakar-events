import Booking from "../models/bookingmodel.js";
import nodemailer from "nodemailer";

// Create transporter with Gmail SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // must be App Password
  },
});

transporter.verify((err, success) => {
  if (err) {
    console.error("Error verifying transporter:", err);
  } else {
    console.log("Email transporter is ready ✅");
  }
});

transporter.verify((err, success) => {
  if (err) {
    console.error("Error verifying transporter:", err);
  } else {
    console.log("Email transporter is ready");
  }
});

export const createBooking = async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();

    // Customer email
    const customerMailOptions = {
      from: process.env.EMAIL_USER,
      to: booking.email,
      subject: "Booking Confirmation - Thank you!",
      html: `
        <h2>Thank you for your booking, ${booking.fullName}!</h2>
        <p>We have received your booking for <b>${booking.eventType}</b> on <b>${new Date(booking.date).toDateString()}</b>.</p>
        <p>Venue: ${booking.venue}</p>
        <p>We will contact you soon for further details.</p>
        <br>
        <p>Best regards,<br>Event Team</p>
      `,
    };

    // Admin email
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New Booking Received from ${booking.fullName}`,
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

    // Debug logs
    console.log("Sending emails from:", process.env.EMAIL_USER);
    console.log("Customer email:", booking.email);
    console.log("Admin email:", process.env.ADMIN_EMAIL);

    // Send both emails with proper try/catch for each
    try {
      const customerResult = await transporter.sendMail(customerMailOptions);
      console.log("Customer email sent:", customerResult.response);

      const adminResult = await transporter.sendMail(adminMailOptions);
      console.log("Admin email sent:", adminResult.response);
    } catch (emailError) {
      console.error("Error sending emails:", emailError);
      return res.status(500).json({
        message: "Booking saved but failed to send emails",
        error: emailError.toString(),
      });
    }

    res.status(201).json({ message: "Booking submitted successfully and emails sent!" });
  } catch (error) {
    console.error("Error saving booking:", error);
    res.status(500).json({ message: "Error saving booking", error });
  }
};

// Get all bookings (for admin)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error });
  }
};
