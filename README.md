# ⚡ CodeEZ — Realtime Collaborative Code Editor

> Code together, instantly. No setup, no friction — just paste a Room ID and start coding.

CodeEZ is a lightweight, real-time collaborative code editor that lets multiple developers write and edit code simultaneously in a shared room. Built with **React**, **Socket.IO**, and **CodeMirror**, it syncs every keystroke across all connected clients in real time.

---

## ✨ Features

- 🔴 **Real-time Collaboration** — Changes are broadcast to all room members instantly via WebSockets
- 🚪 **Room-based Sessions** — Create or join a session using a unique UUID Room ID
- 👥 **Live User Presence** — See who's connected in the sidebar, with join/leave notifications
- 📋 **One-click Room ID Copy** — Copy the room ID to your clipboard and share it instantly
- 🎨 **Dracula Theme Editor** — Syntax-highlighted JavaScript editor powered by CodeMirror 5
- 🔢 **Line Numbers & Auto-close** — Line numbers, auto-close brackets and tags out of the box
- 🔔 **Toast Notifications** — Real-time feedback for join, leave, and copy events
- ↩️ **Code Sync on Join** — New members automatically receive the current code state when they enter a room

---

## 🛠️ Tech Stack

### Frontend (`/client`)
| Technology | Purpose |
|---|---|
| [React 19](https://react.dev/) | UI framework |
| [Vite](https://vite.dev/) | Build tool & dev server |
| [React Router DOM v7](https://reactrouter.com/) | Client-side routing |
| [Socket.IO Client v4](https://socket.io/docs/v4/client-api/) | Real-time WebSocket communication |
| [CodeMirror 5](https://codemirror.net/5/) | Code editor with syntax highlighting |
| [react-hot-toast](https://react-hot-toast.com/) | Toast notifications |
| [react-avatar](https://www.npmjs.com/package/react-avatar) | User avatars in the sidebar |
| [uuid](https://www.npmjs.com/package/uuid) | Generating unique Room IDs |

### Backend (`/server`)
| Technology | Purpose |
|---|---|
| [Node.js](https://nodejs.org/) | Runtime |
| [Express 5](https://expressjs.com/) | HTTP server |
| [Socket.IO v4](https://socket.io/) | WebSocket server |
| [CORS](https://www.npmjs.com/package/cors) | Cross-origin resource sharing |
| [Nodemon](https://nodemon.io/) | Dev auto-restart |

---

## 📁 Project Structure

```
realtime-code-editor/
├── client/                     # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── Components/
│   │   │   ├── Editor.jsx      # CodeMirror editor with Socket.IO sync
│   │   │   └── User.jsx        # Avatar + username display
│   │   ├── pages/
│   │   │   ├── Home.jsx        # Landing page — create/join rooms
│   │   │   └── EditorPage.jsx  # Main editor layout with sidebar
│   │   ├── Actions.js          # Socket event name constants
│   │   ├── socket.js           # Socket.IO client initializer
│   │   ├── App.jsx             # Router setup
│   │   └── main.jsx            # App entry point
│   ├── .env.example
│   ├── vite.config.js
│   └── package.json
│
└── server/                     # Node.js + Express backend
    ├── index.js                # Socket.IO server & event handlers
    ├── Actions.js              # Shared socket event name constants
    ├── .env.example
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [pnpm](https://pnpm.io/) (recommended) or npm

---

### 1. Clone the Repository

```bash
git clone https://github.com/AnshBhandari/realtime-code-editor.git
cd realtime-code-editor
```

---

### 2. Setup the Backend

```bash
cd server
npm install
```

Create a `.env` file from the example:

```bash
cp .env.example .env
```

`.env` variables:

| Variable | Description | Default |
|---|---|---|
| `PORT` | Port the server runs on | `3333` |
| `ALLOWED_ORIGIN` | Frontend URL for CORS | `http://localhost:3000` |

Start the server:

```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

The server will be running at `http://localhost:3333`.

---

### 3. Setup the Frontend

Open a new terminal:

```bash
cd client
pnpm install   # or: npm install
```

Create a `.env` file from the example:

```bash
cp .env.example .env
```

`.env` variables:

| Variable | Description | Default |
|---|---|---|
| `VITE_BACKEND_URL` | URL of the backend server | `http://localhost:3333` |

Start the dev server:

```bash
pnpm dev   # or: npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🔌 How It Works

### Socket Events

CodeEZ uses a simple event-driven architecture over WebSockets:

| Event | Direction | Description |
|---|---|---|
| `join` | Client → Server | User joins a room with their username |
| `joined` | Server → Client | Broadcast to room: new user list + sync trigger |
| `code-change` | Client ↔ Server | Propagate code changes to all room members |
| `sync-code` | Client → Server | Send current code state to a newly joined user |
| `disconnected` | Server → Client | Notify room when a user leaves |

### Room Flow

```
User opens app
     │
     ▼
Enters Room ID + Username ──► Joins existing room
     │
     ▼ (no room ID)
Clicks "new room" ──► UUID generated & copied to clipboard
     │
     ▼
Editor page loads ──► Socket connects ──► Code synced
     │
     ▼
Types code ──► CODE_CHANGE event ──► All other users see update
```

---

## ☁️ Deployment

CodeEZ is split into two independently deployable services.

### Backend — [Render](https://render.com/)

1. Create a new **Web Service** on Render
2. Point it to the `/server` directory
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variable:
   - `ALLOWED_ORIGIN` → your Vercel frontend URL (e.g. `https://your-app.vercel.app`)

### Frontend — [Vercel](https://vercel.com/)

1. Import the repository on Vercel
2. Set the **Root Directory** to `client`
3. Framework preset: **Vite**
4. Add environment variable:
   - `VITE_BACKEND_URL` → your Render backend URL (e.g. `https://your-api.onrender.com`)

---

## 📜 Available Scripts

### Client (`/client`)

| Script | Description |
|---|---|
| `pnpm dev` | Start Vite dev server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm lint` | Run ESLint |

### Server (`/server`)

| Script | Description |
|---|---|
| `npm run dev` | Start with Nodemon (auto-restart) |
| `npm start` | Start with Node |

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [ISC License](LICENSE).

---

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/AnshBhandari">Ansh Bhandari</a></p>
  <p>© 2026 CodeEZ. All rights reserved.</p>
</div>
