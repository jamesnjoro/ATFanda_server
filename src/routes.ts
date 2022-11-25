import express,{Express,Request,Response,Router} from 'express'
import {login, register,validateToken} from './auth'
import {createFundraiser,getFundraisers} from './fundraiser'

const router:Router = express.Router();

router.post('/login',login);
router.post('/register',register);

router.post('/create-fundraiser',validateToken,createFundraiser)
router.get('/fundraisers',validateToken,getFundraisers);



module.exports = router