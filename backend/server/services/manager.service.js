

// @ts-nocheck 

const { setUpZookeeper, zkClient } = require("../libs/setUpZookeeper");

const { RangeService } = require("./range.service");
const { CounterService } = require("./counter.service");
class ManagerService {
    rangeService
    counterService
    zkClient
    redisClient
    path = '/poc'
    constructor(zkClient, redisClient) {
        this.rangeService = new RangeService(zkClient, this.path)
        this.redisClient = redisClient
        this.zkClient = zkClient

    }

    async setUp() {
        const r = await this.rangeService.getRange()
        console.log({range:r})
        this.counterService = new CounterService(this.redisClient, r.range)
    }

    async getCount() {
        // console.log(this.rangeService)
        const r = await this.counterService.getCount()
        if (!r.success) {
            await this.rangeService.markRangeComplete(r.range)
            const res = await this.rangeService.getRange()
            // make full true 
            this.counterService = new CounterService(this.redisClient, res.range)
            const r2 = await this.counterService.getCount()
            if (!r2.success) throw 'error'
            return r2.inc
        }
        return r.inc
    }
}


module.exports = {
    ManagerService
}

