// @ts-nocheck 
const { Router } = require("express");
const { redisClient } = require("./redis");
const { zkClient } = require("./libs/setUpZookeeper");
const {getCount} = require("./libs/getCount");
const { getServerRange } = require("./libs/getServerRange");
const { Manager } = require("./libs/initManager");
const { UrlModel } = require("./models/url.model");
const router = new Router()

// router.get(`/`,function(req,res,next){

//     return res.status(200).json({
//         message : 'ok'
//     })
// })

// router.get('/set',async function(req,res,next){

//     // console.log(req.query)
//     const {key,val} = req.query
//     console.log(req.query)
//     await redisClient.set(req.query.key,req.query.val)
//     return res.sendStatus(200)
// })

// router.get('/get',async function(req,res,next){
//     console.log(req.query.key)
//     const val = await redisClient.get(req.query.key)
//     return res.status(200).json({val})
// })

// router.get(`/config`,function(req,res,next){

    
//     zkClient.getData('/poc',function(err, data, stat){
//         if(err){
//             return res.status(400).json({})
//         }
//         console.log(data)
//         return res.status(200).json(JSON.parse(data.toString()))
//     })
//     // return config ;
// })

// router.get('/count',async (req,res,next)=>{
//     try {
//         const inc = await Manager.getCount()
//         const hex = Number(inc).toString(16)
//         console.log(inc,hex)
//         return res.status(200).json({inc:hex})
//     }catch(err){
//         next(err)
//     }
// })

router.get(`/srt-url`,async (req,res,next)=>{
    try {

        const {u=''} = req.query
        console.log({u})
        const inc = await Manager.getCount()
        const hash = Number(inc).toString(16)
        const url = new UrlModel({
            url : u ,
            hash 
        })
        await url.save()
        return res.status(200).json({url : `http://localhost:3000/${hash}`})
    }catch(error) {
        next(error)
    }
})
router.get(`/:q`,async (req,res,next)=>{
    try {

        const {q=''} = req.params
        console.log({q})
        const url = (await UrlModel.findOne({hash:q}))?.toObject() 
        console.log(url)
        if(!url) return res.sendStatus(404)
        return res.redirect(301,url.url)
    }catch(error) {
        next(error)
    }
})

module.exports = {
    router
}