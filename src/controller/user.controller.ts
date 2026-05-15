import {Request, Response} from "express"
import AuthModel from "../model/auth.model"

export const signup = async(req: Request,res: Response)=>{
   
    try {
        
        await AuthModel.create(req.body);
        res.status(200).json({message: "Signup Success"});
        res.status(200).json({message:"Signup Success"})

    } catch (error:any) {
        
        res.status(500).json({message:error.message})
    }
}

