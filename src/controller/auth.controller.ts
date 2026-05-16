import {Request, Response} from "express"
import AuthModel from "../model/auth.model"
import bcrypt from 'bcrypt'

export const signup = async(req: Request,res: Response)=>{
   
    try {
        
        await AuthModel.create(req.body);
        res.status(200).json({message: "Signup Successfully"});

    } catch (error:any) {
        
        res.status(500).json({message:error.message})
    }
}



export const login = async(req: Request, res: Response)=>{
    
    try {
        const {email, password} = req.body;
        const user = await AuthModel.findOne({email})

        if(!user)
            throw new Error('user not found, please try to signup first')


        const isLogin = await bcrypt.compare(password,user.password)

        if(!isLogin)
            throw new Error("Invalid credentials email or password incorrect")

        res.json({message: "Login Successfully:)"})

    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
    
}

export const forgotPassword = (req: Request, res: Response)=>{
    res.send("Namaste from forgot password");
}