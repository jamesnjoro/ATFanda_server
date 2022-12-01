import {Request,Response} from 'express'
import { Contribution, Fundraiser,Participant,Pledge,sequelize,Sms } from './db';
import {Op,QueryTypes} from 'sequelize'
import {initiateStkPush} from './stanbic'
import sms from './at'

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
        const message = `Thank you, ${participant.name} for your pledge of ${amount}. Hope you get more.`
        sms.send({
            'to':`+254${number.slice(-9)}`,
            'from':'6345',
            'message':message
        }).then()
        .catch((error: any) => console.log(error))
       if(!req.body.local) return res.json({'message':message,pledge})
    }catch(error){
        console.log(error)
        await Participant.sync();
        await Pledge.sync();
        if(!req.body.local)return res.status(500).json({'error':"Something went wrong."})
    }
}

export const makeContribution = async (req:Request,res:Response)=>{
    try{
        const {number,name,amount,fundraiser_id,source} = req.body;
        const [participant,created] = await Participant.findOrCreate({
            where:{number:{
                [Op.substring]: number.slice(-9)
            }},
            defaults:{number,name}
        })
        const contribution = await Contribution.create({
            participant_id:participant.id,
            fundraiser_id,
            amount,
            source
        })
        const message = `Thank you, ${participant.name} for your contribution of ${amount}. Hope you get more.`
        sms.send({
            'to':`+254${number.slice(-9)}`,
            'from':'6345',
            'message':message
        }).then()
        .catch((error: any) => console.log(error))
        if(!req.body.local)return res.json({'message':message,contribution})
    }catch(error){
        console.log(error)
        await Participant.sync();
        await Contribution.sync();
        if(!req.body.local)return res.status(500).json({'error':"Something went wrong."})
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


export const receiveSMS = async(req:Request,res:Response)=>{
    await Sms.sync()
    const {text,from} = req.body
    // 1 = ask name message 
    const participant = await Participant.findOne({where:{number:from.slice(-9)}})
    if(!participant){
        let newParticipant = await Participant.create({
            name:'notProvided',
            number:from.slice(-9)
        })
        const message = `Thank you for you interest, please provide us your name?`
        sms.send({
            'to':`+254${from.slice(-9)}`,
            'from':'6345',
            'message':message
        }).then()
        .catch((error: any) => console.log(error))
        Sms.create({
            participant_id:newParticipant.id,
            sms_type:1,
            msg:message
        })
        return res.json({message:'success'});
    }else{
        const lastSms = await Sms.findOne({where:{participant_id:participant.id},order:[['id','desc']]})
        const options = `Hey ${participant.name}, what would you like to do today:
        1. Make a pledge:
        2. Make a contribution`
        if(lastSms){
            console.log(lastSms)
            switch (lastSms.sms_type){
                case 1:
                case 5:
                    if(lastSms.sms_type == 1){
                        participant.name = text;
                        await participant.save();
                    }
                    const message = `Hey ${participant.name}, what would you like to do today:
                    1. Make a pledge:
                    2. Make a contribution`
                    Sms.create({
                        participant_id:participant.id,
                        sms_type:2,
                        msg:message
                    })
                    sms.send({
                        'to':`+254${from.slice(-9)}`,
                        'from':'6345',
                        'message':message
                    }).then()
                    .catch((error: any) => console.log(error))
                    return res.json({message:'success'});
                    break;
                case 2:
                    const message2 = `Hey ${participant.name}, how much would you like to ${text == 1?'pledge':'contribute'}?`
                    Sms.create({
                        participant_id:participant.id,
                        sms_type:text==1?3:4,
                        msg:message2
                    })
                    sms.send({
                        'to':`+254${from.slice(-9)}`,
                        'from':'6345',
                        'message':message2
                    }).then()
                    .catch((error: any) => console.log(error))
                    return res.json({message:'success'});
                    break;
                case 3:
                case 4:
                    const message3 = `contribution or pledge`
                    Sms.create({
                        participant_id:participant.id,
                        sms_type:5,
                        msg:message3
                    })
                    if(lastSms.sms_type == 4){
                        await sms.send({
                            'to':`+254${from.slice(-9)}`,
                            'from':'6345',
                            'message':`Dear ${participant.name} an mpesa prompt will ask you to provide your pin, please do so.`
                        })
                        req.body.number = from
                        req.body.name = participant.name
                        req.body.amount = text
                        req.body.fundraiser_id = 2
                        req.body.source = 'sms'
                        req.body.local = true
                        try{
                            initiateStkPush({amount:text,number:from})
                        }catch(error){
                            console.log(error)
                        }
                        makeContribution(req,res)
                    }else{
                        req.body.number = from
                        req.body.name = participant.name
                        req.body.amount = text
                        req.body.fundraiser_id = 2
                        req.body.source = 'sms'
                        req.body.local = true
                        makePledge(req,res)
                    }
                    break;
            }
        }else{
            const message = `Hey ${participant.name}, what would you like to do today:
            1. Make a pledge:
            2. Make a contribution`
            Sms.create({
                participant_id:participant.id,
                sms_type:2,
                msg:message
            })
            sms.send({
                'to':`+254${from.slice(-9)}`,
                'from':'6345',
                'message':message
            }).then()
            .catch((error: any) => console.log(error))
        }
        return res.json({message:'success'});
    }
    
}