



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
        console.log(this.rangeService)
        const r = await this.counterService.getCount()
        if (!r.success) {
            const range = await this.rangeService.getRange()
            this.counterService = new CounterService(this.redisClient, range)
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

