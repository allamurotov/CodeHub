import http from "http";
import { Server } from "socket.io";
import { createApp } from "./app";
import { env } from "./config/env";

const app = createApp();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: env.clientUrl,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("join-room", (roomId: string) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-joined", { userId: socket.id });
  });

  socket.on("leave-room", (roomId: string) => {
    socket.leave(roomId);
    socket.to(roomId).emit("user-left", { userId: socket.id });
  });

  socket.on("code-change", (data: { roomId: string; code: string }) => {
    socket.to(data.roomId).emit("code-update", data.code);
  });

  socket.on("cursor-move", (data: { roomId: string; position: any }) => {
    socket.to(data.roomId).emit("cursor-update", { userId: socket.id, position: data.position });
  });

  socket.on("send-message", (data: { roomId: string; message: string }) => {
    socket.to(data.roomId).emit("new-message", { userId: socket.id, message: data.message, timestamp: new Date() });
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

server.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
  console.log(`Environment: ${env.nodeEnv}`);
});

export { io };
