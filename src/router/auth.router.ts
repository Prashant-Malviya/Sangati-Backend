import { Router } from "express";
import { getSession, signup } from "../controller/auth.controller";
import { forgotPassword, login } from "../controller/auth.controller";

const AuthRouter = Router()


AuthRouter.post("/signup", signup);
AuthRouter.post("/login",login);
AuthRouter.post("/forgot-password", forgotPassword);
AuthRouter.get("/session", getSession)

export default AuthRouter;