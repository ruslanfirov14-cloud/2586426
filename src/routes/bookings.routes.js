const express = require("express");
const prisma = require("../db/prisma");
const { optionalAuth } = require("../middlewares/auth");

const router = express.Router();

router.post("/", optionalAuth, async (req, res) => {
  try {
    const { name, phone, email, service, booking_date, booking_time, message } =
      req.body;

    if (!name || !phone || !service || !booking_date || !booking_time) {
      return res.status(400).json({
        message:
          "name, phone, service, booking_date и booking_time обязательны",
      });
    }

    const bookingDate = new Date(booking_date);
    if (Number.isNaN(bookingDate.getTime())) {
      return res.status(400).json({ message: "Некорректная дата записи" });
    }

    const createdBooking = await prisma.booking.create({
      data: {
        userId: req.user?.id || null,
        name: String(name).trim(),
        phone: String(phone).trim(),
        email: String(email || "").trim(),
        service: String(service).trim(),
        bookingDate,
        bookingTime: String(booking_time).trim(),
        message: message ? String(message).trim() : null,
        status: "pending",
      },
    });

    return res.status(201).json({
      message: "Запись создана",
      booking: createdBooking,
    });
  } catch (error) {
    return res.status(500).json({ message: "Ошибка при создании записи" });
  }
});

module.exports = router;
