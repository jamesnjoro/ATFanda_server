import {Request,Response} from 'express'
import { Fundraiser } from './db';
export const createFundraiser = async (req:Request,res:Response)=>{
    try{
        const {name,target} = req.body;
        const user = req.user;
        const fundraiser = await Fundraiser.create({name,target,'user_id':user.id})
        res.json({'message':'Fundraiser created successfully',fundraiser})
    }catch(error){
        console.log(error)
        await Fundraiser.sync()
        return res.status(500).json({'error':'Something went wrong.'})
    }
}

export const getFundraisers = async (req:Request,res:Response)=>{
    const user = req.user;
    const fundraisers = await Fundraiser.findAll({
        where:{user_id : user.id}
    })

    return res.json({'fundraisers':fundraisers})
}