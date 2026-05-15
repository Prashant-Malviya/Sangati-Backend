import { Router } from "express";
import { signup } from "../controller/user.controller";
import { forgotPassword, login } from "../controller/auth.controller";

const AuthRouter = Router()


AuthRouter.post("/signup", signup);
AuthRouter.post("/login",login);
AuthRouter.post("/forgot-password", forgotPassword);

export default AuthRouter;