import { Request, Response } from "express";
import AuthModel from "../model/auth.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CatchError, TryError } from "../util/error";
import { PayloadInterface } from "../middleware/auth.middleware";

const accessTokenExpiry = "10m";

const generateToken = (payload: PayloadInterface) => {
  const accessToken = jwt.sign(payload, process.env.AUTH_SECRET!, {
    expiresIn: accessTokenExpiry,
  });

  return accessToken;
};

export const signup = async (req: Request, res: Response) => {
  try {
    await AuthModel.create(req.body);
    res.status(200).json({ message: "Signup Success" });
  } catch (error: unknown) {

    if(error instanceof Error)
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await AuthModel.findOne({ email });

    if (!user)  throw TryError("User not found, pleaase try to signup first",404)

    const isLogin = await bcrypt.compare(password, user.password);

    if (!isLogin)
      throw TryError("Invalid credentials email or password incorrect",401)

    const payload = {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      mobile: user.mobile,
    };
    const accessToken = generateToken(payload);

    const options = {
        httpOnly: true,
        maxAge: (60*60)*1000,
        secure: false,
        domain: 'localhost'
    }
    res.cookie("accessToken",accessToken,options)
    res.json({ message: "login successfully" });
  } catch (error: unknown) {
    CatchError(error,res, "Login failed please try after sometime")
  }
};

export const forgotPassword = (req: Request, res: Response) => {
  res.send("Namaste from forgot password");
};

export const getSession = async(req: Request, res: Response) => {
  
  try {
    const accessToken = req.cookies.accessToken

    if(!accessToken)
      throw TryError("Invalid session",401);

    const session = await jwt.verify(accessToken,process.env.AUTH_SECRET!)

    res.json(session)
  } catch (error) {
    
    CatchError(error, res, "Invalid session")
  }
}