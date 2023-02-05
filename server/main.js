const express = require('express')
const { router } = require('./router')
const { setupRedis } = require('./redis')
const { setUpZookeeper } = require('./libs/setUpZookeeper')
const { setUpConfig } = require('./setup')

const app = new express() 
const port = process.argv.reverse()[0].split("=")[1] || 3000

app.use(router)


app.listen(port,async ()=>{
    console.log(` --- server running ${port} ---`)
    // set up hear 
    await setupRedis()
    await setUpZookeeper()
    await setUpConfig()
})

// console.log(process.args)