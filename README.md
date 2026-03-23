<div align="center">

<br />

```
██╗  ██╗ █████╗ ██╗     ██╗  ██╗
██║  ██║██╔══██╗██║     ██║ ██╔╝
███████║███████║██║     █████╔╝
██╔══██║██╔══██║██║     ██╔═██╗
██║  ██║██║  ██║███████╗██║  ██╗
╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
```

**A full-stack real-time messaging template.**  
React Native · Expo · NestJS · WebSockets · TypeScript

<br />

![License](https://img.shields.io/badge/license-MIT-white?style=flat-square)
![Node](https://img.shields.io/badge/node-%3E%3D18.x-white?style=flat-square)
![TypeScript](https://img.shields.io/badge/typescript-5.x-white?style=flat-square)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-white?style=flat-square)

<br />

</div>

---

## Overview

Halk is a developer-oriented template for building real-time chat applications. It provides a working foundation — mobile client and backend server — so you can skip the boilerplate and focus on shipping your product.

The client is built with **React Native** and **Expo**, enabling cross-platform deployment to iOS and Android from a single codebase. The server uses **NestJS**, a structured and opinionated Node.js framework that scales well as your application grows. Communication between client and server is handled via **WebSockets**, enabling low-latency, bidirectional message delivery.

> This template is intended as a development starting point. It is not hardened for production use. Security, scaling, and fault tolerance are left to the implementer.

## Preview

<p align="center">
  <img src="https://i.imgur.com/38cNdka.png" alt="Halk UI Preview" width="300" style="border-radius: 5px" />
</p>

---

## Stack

| Layer               | Technology              |
| ------------------- | ----------------------- |
| Mobile Client       | React Native, Expo      |
| Backend Server      | NestJS                  |
| Real-time Transport | WebSockets (Socket.IO)  |
| Language            | TypeScript (full-stack) |

---

## Project Structure

```
halk/
├── client/          # React Native / Expo application
└── server/          # NestJS backend, WebSocket gateway, REST APIs
```

Each workspace is self-contained with its own `package.json` and dependencies. You can develop, test, and deploy them independently.

---

## Prerequisites

Ensure the following are installed before proceeding:

- **Node.js** 18.x or later
- **npm** or **yarn**
- **Expo CLI** — `npm install -g expo-cli`
- **NestJS CLI** _(optional)_ — `npm install -g @nestjs/cli`
- **Expo Go** installed on a physical device, or a configured iOS/Android emulator

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/apozinn/halk.git
cd halk
```

### 2. Install dependencies

```bash
# Client
cd client && npm install

# Server
cd ../server && npm install
```

### 3. Configure environment variables

Create `.env` files in each workspace based on the examples below.

**`server/.env`**

```env
PORT=3000
DATABASE_URL=your_mongodb_connection_string
```

**`client/.env`**

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

When testing on a physical device, replace `localhost` with your machine's LAN IP address (e.g. `http://192.168.1.x:3000`). For Android emulators, use `http://10.0.2.2:3000`.

### 4. Start the development servers

```bash
# Terminal 1 — Backend
cd server && npm run start:dev

# Terminal 2 — Client
cd client && npm start
```

The backend will be available at `http://localhost:3000`. The Expo CLI will display a QR code — scan it with the Expo Go app to launch on your device, or press `i` / `a` to open in a simulator.

---

## License

Released under the [MIT License](./LICENSE).
