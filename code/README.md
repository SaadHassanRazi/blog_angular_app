# 📝 Blog Application

A modern, full-stack blog platform featuring a robust **Node.js/Express/Prisma** backend and a sleek **Angular** frontend. Easily manage users and posts with secure authentication, a PostgreSQL database, and a beautiful UI.

---

## 🚀 Features

- **User Authentication** (JWT, secure password hashing)
- **CRUD Blog Posts** (create, read, update, delete)
- **Pagination** for posts
- **RESTful API** with clear error handling
- **Angular Frontend** with PrimeNG UI
- **Production-ready** configuration

---

## 🗂️ Project Structure

```
code/
  backend/    # Node.js, Express, Prisma, PostgreSQL
  frontend/   # Angular application
```

---

# ⚙️ Quick Start

## 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) (v9+ recommended)
- [PostgreSQL](https://www.postgresql.org/) (local or cloud instance)

---

## 2. Backend Setup

### a. Install Dependencies

```bash
cd code/backend
npm install
```

### b. Configure Environment Variables

Create a `.env` file in `code/backend/`:

```env
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<dbname>
JWT_SECRET=your_jwt_secret
PORT=3000
```

### c. Database Setup & Migration

```bash
npx prisma migrate deploy
```

### d. Start Backend Server

- **Development:**
  ```bash
  npm run dev
  ```
- **Production:**
  1. Build TypeScript:
     ```bash
     npx tsc
     ```
  2. Start server:
     ```bash
     node dist/server.js
     ```

Backend runs at: [http://localhost:3000](http://localhost:3000)

### e. API Documentation

- Full API docs: [`backend/API_DOCUMENTATION.md`](backend/API_DOCUMENTATION.md)
- Key endpoints:
  - `POST /auth/register` — Register
  - `POST /auth/login` — Login
  - `POST /posts/post` — Create post _(auth required)_
  - `GET /posts/` — List posts (paginated)
  - `PUT /posts/post/:id` — Update post _(auth, owner only)_
  - `DELETE /posts/post/:id` — Delete post _(auth, owner only)_

### f. Database Schema (Prisma)

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  createdAt DateTime @default(now())
}
```

---

## 3. Frontend Setup

### a. Install Dependencies

```bash
cd ../frontend
npm install
```

### b. Development Server

```bash
npm start
```

Frontend runs at: [http://localhost:4200](http://localhost:4200)

### c. Production Build

```bash
ng build --configuration production
```

- Output in `dist/` folder
- Deploy `dist/` to your preferred static hosting (Vercel, Netlify, S3, etc.)

### d. Useful Angular CLI Commands

- `ng generate component <name>` — Generate a new component
- `ng build` — Build the project
- `ng test` — Run unit tests
- `ng e2e` — Run end-to-end tests

---

## 4. Frontend-Backend Integration

- The Angular app communicates with the backend via REST API.
- **API Base URL:**
  - For local dev, set API base to `http://localhost:3000` in your Angular environment config if needed.
- **Authentication:**
  - Store JWT token in `localStorage` or `sessionStorage` after login.
  - For protected endpoints, include:
    ```http
    Authorization: Bearer <your_jwt_token>
    ```
- **Error Handling:**
  - All API errors return a JSON `{ "message": "..." }`.
- **Pagination:**
  - Posts endpoint returns 5 posts per page.

---

## 5. Environment Variables

| Variable     | Description                  | Example                                  |
| ------------ | ---------------------------- | ---------------------------------------- |
| DATABASE_URL | PostgreSQL connection string | postgresql://user:pass@localhost:5432/db |
| JWT_SECRET   | Secret for JWT signing       | mysupersecret                            |
| PORT         | Backend server port          | 3000                                     |

---

## 6. Troubleshooting & Tips

- **CORS:**
  - Ensure CORS is enabled for your frontend domain in backend config.
- **Database:**
  - Make sure PostgreSQL is running and accessible.
- **API Errors:**
  - Check backend logs for stack traces.
- **Frontend Build:**
  - If you see build errors, ensure all dependencies are installed and Angular CLI is up to date.

---

## 7. Deployment

- **Backend:** Deploy with [PM2](https://pm2.keymetrics.io/), Docker, or your favorite Node.js host.
- **Frontend:** Deploy the `dist/` folder to any static hosting provider.
- **Environment:** Set environment variables securely in your production environment.

---

## 8. Resources & Documentation

- **Backend API:** [`backend/API_DOCUMENTATION.md`](backend/API_DOCUMENTATION.md)
- **Frontend API Usage:** [`frontend/api.md`](frontend/api.md)
- **Angular CLI Docs:** [angular.io/cli](https://angular.io/cli)
- **Prisma Docs:** [prisma.io/docs](https://www.prisma.io/docs)

---

## 9. License

This project is licensed under the ISC License.

---

## 🙋‍♂️ Need Help?

If you have any questions or issues, please open an issue or contact the maintainer.
