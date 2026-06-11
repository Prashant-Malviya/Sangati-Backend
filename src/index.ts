import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
mongoose
  .connect(process.env.DB!)
  .then(() => console.log("coneected to db"))
  .catch((err) => console.log(err));

import express from "express";
import { createServer } from "http";
import {Server} from 'socket.io'
import cors from "cors";
import cookieParser from "cookie-parser";
import AuthRouter from "./router/auth.router";
import StorageRouter from "./router/storage.router";
import AuthMiddlware from "./middleware/auth.middleware";
import FriendRouter from "./router/friend.router";
import SwaggerConfig from "./util/swagger";
import {serve, setup} from 'swagger-ui-express'

const app = express();
const server = createServer(app);
const io =  new Server(server, {
  cors: {
    origin: process.env.CLIENT,
    credentials: true,
  }
})

server.listen(process.env.PORT || 8080, () =>
  console.log(`server is running on ${process.env.PORT}`),
);

io.on("connection", (client)=>{
  console.log("User connected...");
  
  client.on("message",(msg)=>{
    console.log(`Message recieved from client - ${msg}`);
    client.broadcast.emit("message","Namaste from server...")
  })
})

app.use( 
  cors({
    origin: process.env.CLIENT,
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api-docs", serve, setup(SwaggerConfig))
app.use("/auth", AuthRouter);
app.use("/storage", AuthMiddlware, StorageRouter);
app.use("/friend", AuthMiddlware, FriendRouter);
