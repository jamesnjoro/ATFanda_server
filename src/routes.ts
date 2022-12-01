import express,{Express,Request,Response,Router} from 'express'
import {login, register,validateToken} from './auth'
import {createFundraiser,getFundraisers,makePledge,getPledges,receiveSMS} from './fundraiser'

const router:Router = express.Router();

router.post('/login',login);
router.post('/register',register);

router.post('/create-fundraiser',validateToken,createFundraiser)
router.get('/fundraisers',validateToken,getFundraisers);

router.post('/make-pledge',makePledge)
router.get('/pledges',validateToken,getPledges)

router.post('/receive-sms',receiveSMS);



module.exports = router