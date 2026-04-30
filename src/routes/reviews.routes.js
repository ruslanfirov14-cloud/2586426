const express = require("express");
const prisma = require("../db/prisma");
const { optionalAuth } = require("../middlewares/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { status: "approved" },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ reviews });
  } catch (error) {
    return res.status(500).json({ message: "Ошибка при получении отзывов" });
  }
});

router.post("/", optionalAuth, async (req, res) => {
  try {
    const { name, service, rating, content } = req.body;

    if (!name || !service || !rating || !content) {
      return res
        .status(400)
        .json({ message: "name, service, rating и content обязательны" });
    }

    const parsedRating = Number(rating);
    if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ message: "Оценка должна быть от 1 до 5" });
    }

    const createdReview = await prisma.review.create({
      data: {
        userId: req.user?.id || null,
        name: String(name).trim(),
        service: String(service).trim(),
        rating: parsedRating,
        content: String(content).trim(),
        status: "pending",
      },
    });

    return res.status(201).json({
      message: "Отзыв отправлен на модерацию",
      review: createdReview,
    });
  } catch (error) {
    return res.status(500).json({ message: "Ошибка при отправке отзыва" });
  }
});

module.exports = router;
