# Маникюрный салон «Вера» (Full-stack)

Full-stack приложение на `Node.js + Express + PostgreSQL + Prisma` с фронтендом на чистом `HTML/CSS/JS`.

## Что реализовано

- Авторизация и роли (`client` / `admin`) через JWT
- Регистрация и логин пользователей
- Форма записи на прием (`Bookings`) с сохранением в БД
- Форма отзывов (`Reviews`) с модерацией
- Публичная выдача только одобренных отзывов
- Админ-панель (`admin.html`) для:
  - изменения статусов записей
  - одобрения/удаления отзывов
- Раздача статики через Express (`index.html`, `styles.css`, `script.js`, `gallery/*`)

## Стек

- Backend: `Node.js`, `Express`
- DB: `PostgreSQL`
- ORM: `Prisma`
- Auth: `JWT`
- Frontend: `Vanilla JS + HTML + CSS`

## Структура проекта

```txt
.
├─ server.js
├─ package.json
├─ .env.example
├─ prisma/
│  └─ schema.prisma
├─ src/
│  ├─ db/prisma.js
│  ├─ middlewares/auth.js
│  ├─ routes/
│  │  ├─ auth.routes.js
│  │  ├─ bookings.routes.js
│  │  ├─ reviews.routes.js
│  │  └─ admin.routes.js
│  └─ utils/jwt.js
├─ index.html
├─ services.html
├─ gallery.html
├─ reviews.html
├─ contacts.html
├─ login.html
├─ admin.html
├─ styles.css
├─ script.js
└─ gallery/
```

## Переменные окружения

Создай `.env` по примеру `.env.example`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME?schema=public"
JWT_SECRET="your_strong_secret"
PORT=3000
```

Обязательные переменные для Railway:

- `DATABASE_URL`
- `JWT_SECRET`
- `PORT` (Railway обычно выставляет сам, но можно указать)

## Локальный запуск

1. Установить зависимости:
   - `npm install`
2. Сгенерировать Prisma Client:
   - `npm run prisma:generate`
3. Применить миграции к БД:
   - `npm run prisma:migrate`
4. Запустить сервер:
   - `npm run dev`
   - или `npm start`

Приложение стартует на `process.env.PORT || 3000`.

## API (основные маршруты)

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/bookings`
- `GET /api/reviews`
- `POST /api/reviews`
- `GET /api/admin/bookings` (admin)
- `PATCH /api/admin/bookings/:id` (admin)
- `GET /api/admin/reviews/pending` (admin)
- `PATCH /api/admin/reviews/:id/approve` (admin)
- `DELETE /api/admin/reviews/:id` (admin)

## Деплой на Railway через GitHub

1. Запушить проект в GitHub-репозиторий.
2. В Railway: `New Project` -> `Deploy from GitHub repo`.
3. Добавить PostgreSQL в проект Railway.
4. В Variables добавить:
   - `DATABASE_URL` (из PostgreSQL Railway)
   - `JWT_SECRET`
   - `PORT` (опционально)
5. Убедиться, что Start Command:
   - `npm start`

Примечание:
- В `package.json` добавлен `postinstall: prisma generate`, поэтому Prisma Client соберется автоматически при деплое.
- После первого деплоя нужно выполнить миграции для production БД (через Railway shell/CLI): `npx prisma migrate deploy`.
