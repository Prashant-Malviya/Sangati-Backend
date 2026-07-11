import { Server } from "socket.io";
import cookie from 'cookie';
import jwt from 'jsonwebtoken';

const onlineUsers = new Map();

const StatusSocket = (io: Server) => {
  io.on("connection", (socket) => {

   try {
     
    const rawCookie = socket.handshake.headers.cookie || "";

   const cookies = cookie.parse(rawCookie)
    console.log(rawCookie);

    const accessToken = cookies.accessToken
    
    if(!accessToken)
      throw new Error("Access token not found")

    const user = jwt.verify(accessToken, process.env.AUTH_SECRET! );

    onlineUsers.set(socket.id,user);

   console.log(onlineUsers)

   const userArray = Array.from(onlineUsers.values())
   io.emit("online",userArray);

   socket.on("get-online", ()=>{
    io.emit("online",userArray);
   })

   socket.on("disconnect",()=>{
    onlineUsers.delete(socket.id);
     io.emit("online",userArray);
   })

   } catch (error) {

    if(error instanceof Error)
      console.log(error.message);
    
    socket.disconnect()
   }
  });
};

export default StatusSocket; 
