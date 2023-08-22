
const redis = require('redis');
const { default: Config } = require('./src/config');

var {createClient} = redis ;

export const redisClient = createClient({  
    url :Config.REDIS_URL
}) ;

export const setupRedis = async () => {
    await redisClient.connect()
    console.log(` --- redis connected ---`) 
}

