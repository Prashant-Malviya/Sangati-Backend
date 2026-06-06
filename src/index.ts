import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
mongoose
  .connect(process.env.DB!)
  .then(() => console.log("coneected to db"))
  .catch((err) => console.log(err));

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import AuthRouter from "./router/auth.router";
import StorageRouter from "./router/storage.router";
import AuthMiddlware from "./middleware/auth.middleware";
import FriendRouter from "./router/friend.router";

const app = express();
app.listen(process.env.PORT || 8080, () =>
  console.log(`server is running on ${process.env.PORT}`),
);

app.use(
  cors({
    origin: process.env.CLIENT,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", AuthRouter);
app.use("/storage", AuthMiddlware, StorageRouter);
app.use("/friend", AuthMiddlware, FriendRouter);
