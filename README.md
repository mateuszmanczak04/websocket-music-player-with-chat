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

# Opening the app

Visit `http://[ip]:3000` in your browser, where ip is server's local ip shown in the client terminal.

# Tech stack

Backend runtime: Node.js
Backend framework: Express.js
Web sockets: socket.io
Client framework: Next.js
Client styling: TailwindCSS
Language: TypeScript

# Features

## Music uploading

In the top left corner users have possibility to add their own songs to the library. There are fields for title, .mp3 file and cover image as .jpg. After submiting the form, every connected users starts seeing new item on the tracklist because of the websockets usage. Files are uploaded to the `/uploads` folder on the backend for later access. Songs data are stored in the Postgres database to which url must be specified in `.env` file.

## Tracklist

Below the previously said form we can see the tracklist with all songs in the library. Nothing special.

## Music player

In the middle there is a space for currently selected music player. It has simply 2 buttons - play/pause and delete song options. Below them you can see song timeline where you can change the playback progress. Every user connected to the app with websockets will hear and see the same song and cover. They can also manipulate current player state for other users.

## Encrypted chat

It's a realtime chat communicator allowing connected users to chat each other. It shows currently active users along with their join/leave notifications. Messages are encrypted with `aes-256-cbc` algorithm. Server generates a symmetric key and keeps it in the memory so when we restart the app all older messages are unable to be decrypted. It's not real E2EE because for this we would need one user who is group creator, here is only one chat room so it's impossible. After 5s inactivity users on top start appearing yellow instead of green.
