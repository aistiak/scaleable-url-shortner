

const getCount = async (redisClient, range) => {

    // get current count 
    const count = await redisClient.get(range) || 1 
    console.debug({ count })
    // inct 
    const inc = Number(count) + 1
    console.debug({ inc })
    // set
    await redisClient.set(range, inc)
    // return 
    return inc
}


module.exports = {
    getCount 
}