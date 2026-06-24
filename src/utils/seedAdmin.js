const bcrypt = require("bcrypt");
const prisma = require("../db/prisma");

async function ensureAdminUser() {
  const email = (process.env.ADMIN_EMAIL || "admin@vera.ru").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const name = process.env.ADMIN_NAME || "Администратор";

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    if (existingUser.role !== "admin") {
      await prisma.user.update({
        where: { email },
        data: { role: "admin" },
      });
      console.log(`Роль admin назначена пользователю ${email}`);
    }
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: "admin",
    },
  });

  console.log(`Создан администратор: ${email}`);
}

module.exports = { ensureAdminUser };
