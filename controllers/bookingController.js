const Booking = require('../models/Booking');
const sendEmail = require('../config/email');

exports.createBooking = async (req, res) => {
  try {
    // 🟢 Log incoming data before anything else
    console.log("📦 Incoming booking data:", req.body);

    const booking = new Booking(req.body);
    await booking.save();

    // Format dates for email
    const formatDate = (date) => new Date(date).toLocaleDateString();

    // Customer email
    const customerMail = {
      to: booking.email,
      subject: `Booking Confirmation for ${booking.roomCategory}`,
      html: `
        <h2>Dear ${booking.name},</h2>
        <p>Your booking has been confirmed!</p>
        <h3>Booking Details:</h3>
        <p><strong>Room:</strong> ${booking.roomCategory}</p>
        <p><strong>Price:</strong> ${booking.roomPrice}</p>
        <p><strong>Check-in:</strong> ${formatDate(booking.checkIn)}</p>
        <p><strong>Check-out:</strong> ${formatDate(booking.checkOut)}</p>
        ${booking.specialRequests ? `<p><strong>Requests:</strong> ${booking.specialRequests}</p>` : ''}
        <p>Thank you for choosing us!</p>
      `
    };

    // Admin email
    const adminMail = {
      to: process.env.ADMIN_EMAIL,
      subject: `New Booking: ${booking.roomCategory}`,
      html: `
        <h2>New Booking Notification</h2>
        <p><strong>Customer:</strong> ${booking.name}</p>
        <p><strong>Contact:</strong> ${booking.phone}</p>
        <p><strong>Room:</strong> ${booking.roomCategory}</p>
        <p><strong>Dates:</strong> ${formatDate(booking.checkIn)} to ${formatDate(booking.checkOut)}</p>
      `
    };

    // 🟢 Try sending emails but don’t let email failure block booking save
    try {
      await Promise.all([
        sendEmail(customerMail),
        sendEmail(adminMail)
      ]);
    } catch (emailErr) {
      console.error("⚠️ Email sending failed:", emailErr.message);
    }

    res.status(201).json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error("❌ Booking creation error:", error);
    res.status(400).json({
      success: false,
      error: error.message || 'Unknown error'
    });
  }
};
