import { Request, Response } from "express";
import AuthModel from "../model/auth.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const accessTokenExpiry = "10m";

interface PayloadInterface {
  id: mongoose.Types.ObjectId;
  fullname: string;
  email: string;
  mobile: string;
}

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
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await AuthModel.findOne({ email });

    if (!user) throw new Error("User not found, pleaase try to signup first");

    const isLogin = await bcrypt.compare(password, user.password);

    if (!isLogin)
      throw new Error("Invalid credentials , email or password incorrect");

    const payload = {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      mobile: user.mobile,
    };
    const accessToken = generateToken(payload);

    const options = {
        httpOnly: true,
        maxAge: (10*60)
    }
    res.cookie("accessToken",accessToken,options)
    res.json({ message: "login successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = (req: Request, res: Response) => {
  res.send("Namaste from forgot password");
};
