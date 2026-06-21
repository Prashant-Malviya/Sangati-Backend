import { Server } from "socket.io";

const onlineUsers = new Set();

const StatusSocket = (io: Server) => {
  io.on("connection", (socket) => {
    socket.on("disconnect", () => {
      console.log(`User disconnected - ${socket.id}`);
    });
  });
};

export default StatusSocket;
