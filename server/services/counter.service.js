

class CounterService {

    redisClient
    range
    constructor(redisClient, range) {
        this.redisClient = redisClient
        this.range = range
    }

    async getCount() {
        console.log({
            range : this.range
        })
        const [start, end] = this.range.split("_").map(v => Number(v))
        console.log({ start, end })
        // get current count 
        const count = await this.redisClient.get(this.range) || start
        console.debug({ count })
        if (count >= end) return {success : false  , range : this.range} // try to get new range 
        // inct 
        const inc = Number(count) + 1
        console.debug({ inc })
        // set
        await this.redisClient.set(this.range, inc)
        // return 
        return {success: true ,inc , range : this.range}
    }
}


module.exports = {
    CounterService
}