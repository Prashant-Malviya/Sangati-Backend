import {Request, Response} from "express"

export const signup = (req:Request, res:Response)=>{

    res.send("hellow")
}

export const login = (req: Request, res: Response)=>{
    res.send("Namaste from login")
}

export const forgotPassword = (req: Request, res: Response)=>{
    res.send("Namaste from forgot password");
}