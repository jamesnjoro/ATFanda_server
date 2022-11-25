import express, {Express,Router} from 'express'
const router:Router = require('./routes')
const app:Express = express();
const cors = require('cors')


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}));
app.use('/api/v1',router);

app.listen(3000,()=>{
    console.log("Server running on 127.0.0.1:3000")
})