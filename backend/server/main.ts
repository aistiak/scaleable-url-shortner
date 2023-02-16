import { connectToDatabase, MongoConnection } from "./libs/connectToDatabase"


// @ts-nocheck 
const express = require('express')
const { router } = require('./router')
const { setupRedis } = require('./redis')
const { setUpZookeeper } = require('./libs/setUpZookeeper')
const { setUpConfig } = require('./setup')
const { setUpManager } = require('./libs/initManager')
import cors from 'cors';
import cookieParser from 'cookie-parser'
import Config from './config'
const app = new express()
const port = Config.EXPRESS_PORT // process.argv.reverse()[0].split("=")[1] || 4002 //process.env.SERVER_PORT



// var credentials = {key: privateKey, cert: certificate};


app.use(cors({
    origin: Config.FRONTEND_URL,
    credentials: true
}))
app.use(cookieParser())
app.use(router)

// var httpsServer = https.createServer(credentials, app);
const CB = async () => {
    console.log(` --- server running ${port} ---`)
    // set up hear 
    await connectToDatabase()
    await setupRedis()
    await setUpZookeeper()
    await setUpConfig()
    await setUpManager()
}
app.listen(port,CB)