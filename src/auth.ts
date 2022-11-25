import{Request,Response,NextFunction} from 'express'
import bcrypt from 'bcrypt'
import { User } from './db'
import jwt from 'jsonwebtoken'

declare global {
    namespace Express {
      interface Request {
        user?: any
      }
    }
  }

const saltRounds = 10;
const key = 'thisbetterworkasexpectedorelseillbeherallday'
export const login = async (req:Request,res:Response)=>{
    try{
        const {number,password} = req.body;
    const user = await User.findOne({where:{number}});
    if(user){
        const passValid = await bcrypt.compare(password,user.password);
        if(passValid){
            const userJson = user.toJSON(); 
            userJson.password = '';
            const token = jwt.sign(userJson,key);
            return res.json({token,'user':userJson})
        }
    }else{
        return res.status(403).json({error:"Phone number not linked to any account."})
    }
    }catch(error){
        console.log(error)
        return res.status(500).json({'error':"Something went wrong."})
    }
    
}

export const register = async (req:Request,res:Response)=>{
    try{
        const {number,password} = req.body;
        const hash = await bcrypt.hash(password,saltRounds);
        const user = await User.create({
            number,password:hash
        });
        const userJson = user.toJSON(); 
        userJson.password = '';
        const token = jwt.sign(userJson,key);
        return res.json({token,'user':userJson})
    }catch(error){
        console.log(error)
        await User.sync();
        return res.status(500).json({'error':"Something went wrong, please try again."})
    }
    
}


export const validateToken = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const authToken = req.headers.authorization;
    const token = authToken && authToken.split(' ')[1]
    if(token){
        const user = jwt.verify(token,key)
        if(user){
            req.user = user;
            next()
        }else{
            return res.status(401).json({'error':'Authentication provided not valid'});
        }
    }else{
        return res.status(401).json({'error':'User not authenticated'});
    }
    }catch(error){
        console.log(error)
        return res.status(401).json({'error':'Authentication provided not valid'});
    }
    
}