import jwt from "jsonwebtoken"
import { createError } from "./error.js"

export const verifyToken =(req,res,next)=>{
    const token= req.cookies.access_token
    if(!token) return next(createError(401,"You are not authenticated"))

    jwt.verify(token,process.env.JWT,(err,user)=>{  //verify the token is valid
        if(err) return next(createError(403,"Token is not valid"))
        req.user=user // assigning info we got from jwt token to req user so that we can use it in any api request
        next() //continue from where we left
    }) 
}