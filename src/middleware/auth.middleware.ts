import { NextFunction, Request, Response } from "express";
import { CatchError, TryError } from "../util/error";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

export interface PayloadInterface {
  id: mongoose.Types.ObjectId;
  fullname: string;
  email: string;
  mobile: string;
}

export interface SessionInterface extends Request{
    session?: PayloadInterface
}

const AuthMiddlware = async(req:SessionInterface, res:Response, next: NextFunction)=>{
   
    try {

    const accessToken = req.cookies.accessToken;

    if(!accessToken){
        throw TryError("Unauthorized!", 401)
    }

    const payload = await jwt.verify(accessToken, process.env.AUTH_SECRET!) as JwtPayload

    console.log(payload);
    
    req.session = {
        id: payload.id,
        email: payload.email,
        mobile: payload.mobile,
        fullname: payload.fullname,
    }

    next()

    } catch (error) {
        
        CatchError(error,res, "Unauthorized");
    }

}

export default AuthMiddlware;