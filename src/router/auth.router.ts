import { Router } from "express";
import { getSession, refreshToken, signup, updateProfilePicture } from "../controller/auth.controller";
import { login } from "../controller/auth.controller";
import AuthMiddlware from "../middleware/auth.middleware";
import RefreshToken from "../middleware/refresh.middleware";

const AuthRouter = Router()


AuthRouter.post("/signup", signup);
AuthRouter.post("/login",login);
AuthRouter.get("/refresh-token", RefreshToken,refreshToken);
AuthRouter.get("/session", getSession)
AuthRouter.put("/profile-picture", AuthMiddlware, updateProfilePicture)


export default AuthRouter;