import Booking from "../models/bookingmodel.js";
import sgMail from "@sendgrid/mail";

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const createBooking = async (req, res) => {
  try {
    // Save booking
    const booking = new Booking(req.body);
    await booking.save();

    // Customer email
    const customerEmail = {
      to: booking.email,
      from: process.env.EMAIL_USER, // Must be verified in SendGrid
      subject: "Booking Confirmation - Thank you!",
      html: `
        <h2>Thank you for your booking, ${booking.fullName}!</h2>
        <p>We have received your booking for <b>${booking.eventType}</b> on <b>${new Date(booking.date).toDateString()}</b>.</p>
        <p><b>Venue:</b> ${booking.venue}</p>
        <p>We will contact you soon for further details.</p>
        <br>
        <p>Best regards,<br>Event Team</p>
      `,
    };

    // Admin email
    const adminEmail = {
      to: process.env.ADMIN_EMAIL,
      from: process.env.EMAIL_USER,
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

    // Send both emails
    console.log("📧 Sending emails via SendGrid...");
    
    try {
      await sgMail.send(customerEmail);
      console.log("✅ Customer email sent");
    } catch (error) {
      console.error("❌ Customer email error:", error.response?.body || error.message);
    }

    try {
      await sgMail.send(adminEmail);
      console.log("✅ Admin email sent");
    } catch (error) {
      console.error("❌ Admin email error:", error.response?.body || error.message);
    }

    res.status(201).json({ 
      message: "Booking submitted successfully!" 
    });

  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ 
      message: "Error processing booking", 
      error: error.message 
    });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error });
  }
};