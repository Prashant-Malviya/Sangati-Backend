import { Request, Response } from "express";
import AuthModel from "../model/auth.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CatchError, TryError } from "../util/error";
import { PayloadInterface, SessionInterface } from "../middleware/auth.middleware";
import { downloadObject } from "../util/s3";
import {v4 as uuid} from 'uuid'
import moment from "moment";

const accessTokenExpiry = "10m";
const tenMinutesInMs =  (10*60)*1000
const seventDaysInMs = (7*24*60*60)*1000

type TokenType = "at" | "rt"

const generateToken = (payload: PayloadInterface) => {
  const accessToken = jwt.sign(payload, process.env.AUTH_SECRET!, {
    expiresIn: accessTokenExpiry,
  });

  const refreshToken = uuid()

  return {
    accessToken,
    refreshToken
  }
};

const getOptions = (tokenType: TokenType)=>{
  return {
    httpOnly: true,
    maxAge: tokenType === "at" ? tenMinutesInMs : seventDaysInMs,
    secure: false,
    domain: "localhost"
  }
}

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
      image : user.image ? await downloadObject(user.image) : null
    };

    const {accessToken, refreshToken} = generateToken(payload);

    await AuthModel.updateOne({_id: user._id}, {$set: {refreshToken, expiry: moment().add(7,'days').toDate()}})

    res.cookie("accessToken",accessToken,getOptions('at'))
    res.cookie("refreshToken",refreshToken, getOptions('rt'))
    res.json({ message: "login successfully" });
  } catch (error: unknown) {
    CatchError(error,res, "Login failed please try after sometime")
  }
};

export const refreshToken = async(req: SessionInterface, res: Response) => {
  
  try {
    
    if(!req.session)
      throw TryError("Failed to refresh token", 401)

    req.session.image = (req.session.image ? await downloadObject(req.session.image) : null)
    
    const {accessToken,refreshToken} = generateToken(req.session);
    
    await AuthModel.updateOne({_id:req.session.id}, {$set: {
      refreshToken,
      expiry: moment().add(7,'days').toDate()
    }})

    res.cookie('accessToken', accessToken, getOptions('at'))
    res.cookie('refreshToken', refreshToken,getOptions('rt'))
    res.json({message: 'Token Refreshed'})
    
  } catch (error) {
    
    CatchError(error, res, "Failed to refresh token")
  }
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

export const updateProfilePicture = async (req: SessionInterface, res: Response)=>{
  try {
    const path = req.body.path;

    if(!path || !req.session)
      throw TryError("Failed to update profile picture",400)
    
   await AuthModel.updateOne({_id: req.session.id}, {$set: {image: path}})

   const url = await downloadObject(path);
   res.json({image:url})

  } catch (error) {
    
    CatchError(error, res, "Failed to update profile picture")
  }
}
