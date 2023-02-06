const { Router } = require("express");
const { redisClient } = require("./redis");
const { zkClient } = require("./libs/setUpZookeeper");
const {getCount} = require("./libs/getCount");
const { getServerRange } = require("./libs/getServerRange");
const { Manager } = require("./libs/initManager");
const router = new Router()

router.get(`/`,function(req,res,next){

    return res.status(200).json({
        message : 'ok'
    })
})

router.get('/set',async function(req,res,next){

    // console.log(req.query)
    const {key,val} = req.query
    console.log(req.query)
    await redisClient.set(req.query.key,req.query.val)
    return res.sendStatus(200)
})

router.get('/get',async function(req,res,next){
    console.log(req.query.key)
    const val = await redisClient.get(req.query.key)
    return res.status(200).json({val})
})

router.get(`/config`,function(req,res,next){

    
    zkClient.getData('/poc',function(err, data, stat){
        if(err){
            return res.status(400).json({})
        }
        console.log(data)
        return res.status(200).json(JSON.parse(data.toString()))
    })
    // return config ;
})

router.get('/count',async (req,res,next)=>{
    try {
        const inc = await Manager.getCount()
        const hex = Number(inc).toString(16)
        console.log(inc,hex)
        return res.status(200).json({inc:hex})
    }catch(err){
        next(err)
    }
})

module.exports = {
    router
}