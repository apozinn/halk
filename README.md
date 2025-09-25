# Halk

Halk is a **real-time chat application template** built with **React Native (Expo)** on the client side and **NestJS** on the backend.  
It is designed for learning, experimentation, or as a foundation for your own chat or messaging app.

> ⚠️ **Note**: This template is *not production-ready*. It lacks many production concerns such as security hardening, scaling, and full error handling.

---

## Table of Contents

1. [Features](#features)  
2. [Screenshot](#screenshot)  
3. [Project Structure](#project-structure)  
4. [Prerequisites](#prerequisites)  
5. [Installation & Setup](#installation--setup)  
6. [Running the App](#running-the-app)  
7. [Environment Variables](#environment-variables)  
8. [Roadmap & Next Steps](#roadmap--next-steps)  
9. [License](#license)  

---

## Features

- 📱 Cross-platform mobile using React Native + Expo  
- ⚡ Real-time messaging via WebSockets  
- 🏗 Modular backend architecture using NestJS  
- 🛠 Entire stack written in TypeScript  
- 🔄 Basic chat flow scaffolding (sending/receiving messages)  

---

## Screenshot

Here is a screenshot of the chat UI when running in Expo:

<p align="center">
  <img src="https://camo.githubusercontent.com/d40f10f4e9f4556abc5bc36e51a1810beb9525c81d9d1220795a82b39ee01c39/68747470733a2f2f692e696d6775722e636f6d2f3338634e646b612e706e67" alt="Halk Chat Screenshot" width="300"/>
</p>


---

## Project Structure

```
halk/
├── client/     # React Native / Expo mobile app
└── server/     # NestJS backend, WebSocket gateway, APIs, etc.
```

Each folder is mostly self-contained, making it easier to work on one side without interfering with the other.

---

## Prerequisites

Before you begin, make sure you have:

- **Node.js** (recommended version: 18.x or newer)  
- **npm** or **yarn**  
- **Expo CLI**: `npm install -g expo-cli`  
- **NestJS CLI** (optional but useful): `npm install -g @nestjs/cli`  
- **Expo Go app** installed on a real device (iOS or Android), or an emulator/simulator  

---

## Installation & Setup

Follow these steps to get the project up and running:

### 1. Clone repository

```bash
git clone https://github.com/apozinn/halk.git
cd halk
```

### 2. Install dependencies

#### Client

```bash
cd client
npm install
```

or if you prefer yarn:

```bash
yarn install
```

#### Server

```bash
cd ../server
npm install
```

or with yarn:

```bash
yarn install
```

---

## Running the App

You can run both client and server in development mode side by side.

### 1. Start the backend (NestJS)

```bash
cd server
npm run start:dev
```

This will run the backend typically on `http://localhost:3000`.

### 2. Start the client (Expo)

From the **client** folder:

```bash
cd ../client
npm start
```

This command will:

- Open the Expo developer tools in the browser  
- Show a QR code you can scan with the Expo Go app  
- Let you run on a simulator/emulator  

Once launched, you should see a mobile UI similar to the screenshot.

---

## Environment Variables

You may want to configure settings via `.env` files in each folder.

### server/.env (example)

```env
PORT=3000
# Backend port
DATABASE_URL=MONGO_DB_URL
# DB connection URL.
```

### client/.env (example)

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
# You may add other client-side config variables here
```

Make sure the `EXPO_PUBLIC_API_URL` points to where your backend is running (e.g. `http://10.0.2.2:3000` or your LAN IP, if testing on a real device).

---

## Roadmap & Next Steps

Here are some ideas you or contributors can build next:

- [ ] Add **user authentication** (JWT, login/signup flows)  
- [ ] Persist messages in a database (PostgreSQL, MongoDB, etc.)  
- [ ] Enhance error handling and reconnection logic  
- [ ] Support **multiple chat rooms**, group chats, private messages  
- [ ] Deploy backend to a cloud provider (Heroku, AWS, DigitalOcean)  
- [ ] Add offline support, message queueing, retry logic  
- [ ] Write unit + integration tests for both client and server  
- [ ] Secure the app: input validation, authorization, rate limiting  

---

## License

This project is licensed under the **MIT License**.  