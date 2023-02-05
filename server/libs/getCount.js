

const getCount = async (redisClient, range) => {

    const [start,end]  = range.split("_").map(v => Number(v))
    console.log({start,end})
    // get current count 
    const count = await redisClient.get(range) || start
    console.debug({ count })
    if(count >= end) throw 'range over' // try to get new range 
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

/**
 * 
 *  manager class - counter class (net count ), range class (get available range )
 * 
*/