require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const prisma = require("./src/db/prisma");
const authRoutes = require("./src/routes/auth.routes");
const bookingsRoutes = require("./src/routes/bookings.routes");
const reviewsRoutes = require("./src/routes/reviews.routes");
const adminRoutes = require("./src/routes/admin.routes");
const { requireAuth, requireAdmin } = require("./src/middlewares/auth");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/auth/me", requireAuth, (req, res) => {
  return res.json({ user: req.user });
});

app.get("/api/admin/ping", requireAuth, requireAdmin, (req, res) => {
  return res.json({ ok: true, message: "Admin access granted" });
});

app.get("/api/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.json({ ok: true, database: "connected" });
  } catch (error) {
    return res.status(500).json({ ok: false, database: "disconnected" });
  }
});

async function startServer() {
  try {
    const { ensureAdminUser } = require("./src/utils/seedAdmin");
    await ensureAdminUser();
  } catch (error) {
    console.error("Не удалось создать администратора:", error.message);
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
