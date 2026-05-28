import { Router } from "express";
import { getSession, signup, updateProfilePicture } from "../controller/auth.controller";
import { forgotPassword, login } from "../controller/auth.controller";
import AuthMiddlware from "../middleware/auth.middleware";

const AuthRouter = Router()


AuthRouter.post("/signup", signup);
AuthRouter.post("/login",login);
AuthRouter.post("/forgot-password", forgotPassword);
AuthRouter.get("/session", getSession)
AuthRouter.put("/profile-picture", AuthMiddlware, updateProfilePicture)


export default AuthRouter;