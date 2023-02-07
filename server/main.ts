import { connectToDatabase, MongoConnection } from "./libs/connectToDatabase"


// @ts-nocheck 
const express = require('express')
const { router } = require('./router')
const { setupRedis } = require('./redis')
const { setUpZookeeper } = require('./libs/setUpZookeeper')
const { setUpConfig } = require('./setup')
const { setUpManager } = require('./libs/initManager')

const app = new express() 
const port = process.argv.reverse()[0].split("=")[1] || 3000

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