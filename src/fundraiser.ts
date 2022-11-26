import {Request,Response} from 'express'
import { Fundraiser,Participant,Pledge,sequelize } from './db';
import {Op,QueryTypes} from 'sequelize'
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

export const makePledge = async (req:Request,res:Response)=>{
    try{
        const {number,name,amount,fundraiser_id,source} = req.body;
        const [participant,created] = await Participant.findOrCreate({
            where:{number:{
                [Op.substring]: number.slice(-9)
            }},
            defaults:{number,name}
        })
        const pledge = await Pledge.create({
            participant_id:participant.id,
            fundraiser_id,
            amount,
            source
        })
        return res.json({'message':"Your pledge has been recorded, thank you",pledge})
    }catch(error){
        console.log(error)
        await Participant.sync();
        await Pledge.sync();
        return res.status(500).json({'error':"Something went wrong."})
    }
}

export const getPledges = async (req:Request,res:Response)=>{
    const user = req.user;
    const pledges = await sequelize.query(
        `SELECT Pledges.id,Participants.name,Participants.number,amount,Fundraisers.name as fundraiser FROM Pledges 
        JOIN Fundraisers on Fundraisers.id = Pledges.fundraiser_id 
        JOIN Participants on Participants.id = Pledges.participant_id 
        WHERE Fundraisers.user_id =${user.id}`,{type:QueryTypes.SELECT}
    )
    res.json(pledges);
}