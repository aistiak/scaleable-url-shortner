// @ts-nocheck 
const redis = require('redis');
const { default: Config } = require('./config');

var {createClient} = redis ;
const redisClient = createClient({  
    url :Config.REDIS_URL
}) ;

const setupRedis = async () => {
    await redisClient.connect()
    console.log(` --- redis connected ---`) 
}

module.exports = {
    redisClient,
    setupRedis
}

