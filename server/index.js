const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const { ACTIONS } = require("./Actions");

const server = http.createServer(app);

const allowedOrigin =
  process.env.ALLOWED_ORIGIN || "http://localhost:3000";

const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    methods: ["GET", "POST"],
  },
});

const userSocketMap = new Map();

function getAllConnectedUsers(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap.get(socketId),
      };
    },
  );
}

io.on("connection", (socket) => {
  console.log("A user connected, socket id:", socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap.set(socket.id, username);
    socket.join(roomId);
    const users = getAllConnectedUsers(roomId);
    // console.log(users);
    users.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        users,
        username,
        socketId: socket.id,
      });
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, {
      code,
    });
    // socket.to(roomId).emit(ACTIONS.CODE_CHANGE, {
    //   code,
    // });
    // socket.broadcast.to(roomId).emit(ACTIONS.CODE_CHANGE, {
    //   code,
    // });
    // socket.broadcast.in(roomId).emit(ACTIONS.CODE_CHANGE, {
    //   code,
    // });
    // io.to(roomId).emit(ACTIONS.CODE_CHANGE, {
    //   code,
    // });
    // io.in(roomId).emit(ACTIONS.CODE_CHANGE, {
    //   code,
    // });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ code, socketId }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, {
      code,
    });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap.get(socket.id),
      });
    });
    userSocketMap.delete(socket.id);
    socket.leave();
    console.log("A user disconnected");
  });
});

const PORT = process.env.PORT || 3333;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
