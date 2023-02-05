const redis = require('redis')

var {createClient} = redis ;
const redisClient = createClient({
    url :'redis://localhost:6379'
}) ;

const setupRedis = async () => {
    await redisClient.connect()
    console.log(` --- redis connected ---`)
}

module.exports = {
    redisClient,
    setupRedis
}

