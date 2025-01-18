# It's a Spotify Clone app made for my Computer Networks university course

Frontend is running on port 3000 and backend on 4000

# Getting started

You have to open 2 terminals at the same time as frontend and backend are running separately.

First terminal (frontend):

1. run `bun install`
2. run `bun run dev`

Second terminal (backend):

1. cd backend
2. run `bun install`
3. touch `.env`
4. put `DATABASE_URL` variable into `.env` file, it should be postgres database
5. run `bunx prisma db push`
6. run `bun run dev`

# Using app

Visit `http://localhost:3000` in your browser and you should see UI.
