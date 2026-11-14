# HireFlow Backend

HireFlow is a recruitment operations backend built for managing candidates, recruiters, and posts in a production-style API setup.

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM 7
- Docker-ready project layout

## Project Structure

```text
prisma/
  schema.prisma      # database models
  migrations/        # SQL history, created by prisma migrate
prisma.config.ts     # Prisma CLI config (reads DATABASE_URL)
src/
  app.js
  server.js
  config/
    env.js
    prisma.js        # shared Prisma client
  controllers/
    healthController.js
    postController.js
  generated/prisma/  # generated client (git-ignored)
  middlewares/
    errorHandler.js
  routes/
    index.js
```

## Environment Setup

1. Copy `.env.example` to `.env`
2. Update values as needed
3. Install dependencies:

```bash
npm install          # also runs prisma generate
npm run db:migrate   # create/update tables in Postgres
```

After changing `prisma/schema.prisma`, run `npm run db:migrate -- --name <change>`.
Use `npm run db:studio` to browse the data.

## Run the app

```bash
npm run dev
```

The app starts on the port defined in `.env` or defaults to `5000`.

## Health check

```bash
curl http://localhost:5000/health
```

## Posts API

### Get all posts

```bash
curl http://localhost:5000/api/posts
```

### Create a post

```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Hiring update",
    "content": "We are looking for an experienced frontend engineer.",
    "author": "Recruiter"
  }'
```
