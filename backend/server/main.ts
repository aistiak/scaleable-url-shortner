import { connectToDatabase, MongoConnection } from "./libs/connectToDatabase"


// @ts-nocheck 
const express = require('express')
const { router } = require('./router')
const { setupRedis } = require('./redis')
const { setUpZookeeper } = require('./libs/setUpZookeeper')
const { setUpConfig } = require('./setup')
const { setUpManager } = require('./libs/initManager')
import cors from 'cors' ;
import cookieParser from 'cookie-parser'
import Config from './config'
const app = new express() 
const port = Config.EXPRESS_PORT // process.argv.reverse()[0].split("=")[1] || 4002 //process.env.SERVER_PORT
app.use(cors({
    origin : Config.FRONTEND_URL,
    credentials : true 
}))
app.use(cookieParser())
app.use(router)

app.listen(port,async ()=>{
    console.log(` --- server running ${port} ---`)
    // set up hear 
    await connectToDatabase()
    await setupRedis()
    await setUpZookeeper()
    await setUpConfig()
    await setUpManager()

    // console.log({MongoConnection})
})

// console.log(process.args)