

import Config from '../configs';


const redis = require("redis")

export const redisClient = redis?.createClient({  
    url :Config.REDIS_URL
}) ;

export const setupRedis = async () => {
    await redisClient.connect()
    console.log(` --- redis connected ---`) 
}

