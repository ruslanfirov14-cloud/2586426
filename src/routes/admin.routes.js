const express = require("express");
const prisma = require("../db/prisma");
const { requireAuth, requireAdmin } = require("../middlewares/auth");

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get("/bookings", async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.json({ bookings });
  } catch (error) {
    return res.status(500).json({ message: "Ошибка при получении записей" });
  }
});

router.patch("/bookings/:id", async (req, res) => {
  try {
    const bookingId = Number(req.params.id);
    const { status } = req.body;

    if (!Number.isInteger(bookingId)) {
      return res.status(400).json({ message: "Некорректный id записи" });
    }

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Некорректный статус записи" });
    }

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });

    return res.json({ message: "Статус записи обновлен", booking });
  } catch (error) {
    return res.status(500).json({ message: "Ошибка при обновлении статуса записи" });
  }
});

router.get("/reviews/pending", async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { status: "pending" },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ reviews });
  } catch (error) {
    return res.status(500).json({ message: "Ошибка при получении отзывов" });
  }
});

router.patch("/reviews/:id/approve", async (req, res) => {
  try {
    const reviewId = Number(req.params.id);
    if (!Number.isInteger(reviewId)) {
      return res.status(400).json({ message: "Некорректный id отзыва" });
    }

    const review = await prisma.review.update({
      where: { id: reviewId },
      data: { status: "approved" },
    });

    return res.json({ message: "Отзыв одобрен", review });
  } catch (error) {
    return res.status(500).json({ message: "Ошибка при одобрении отзыва" });
  }
});

router.delete("/reviews/:id", async (req, res) => {
  try {
    const reviewId = Number(req.params.id);
    if (!Number.isInteger(reviewId)) {
      return res.status(400).json({ message: "Некорректный id отзыва" });
    }

    await prisma.review.delete({ where: { id: reviewId } });
    return res.json({ message: "Отзыв удален" });
  } catch (error) {
    return res.status(500).json({ message: "Ошибка при удалении отзыва" });
  }
});

module.exports = router;
