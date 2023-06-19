import ConnectionInterface from "../interfaces/connection.interface"
import RangeService from "./range.service"
import CounterService from "./counter.service"





class ManagerService {
    rangeService: RangeService
    counterService: any
    zkClient: ConnectionInterface
    redisClient: ConnectionInterface
    path = '/poc'
    constructor(zkClient: ConnectionInterface, redisClient: ConnectionInterface, rangeService: RangeService) {
        this.rangeService = rangeService // new RangeService(zkClient, this.path)
        this.redisClient = redisClient
        this.zkClient = zkClient
        this.counterService = null

    }

    async setUp() {
        const r: any = await this.rangeService.getRange()
        console.log({ range: r })
        this.counterService = new CounterService(this.redisClient, r.range)
    }

    async getCount() {
        // console.log(this.rangeService)
        const r = await this.counterService.getCount()
        if (!r.success) {
            await this.rangeService.markRangeComplete(r.range)
            const res :any = await this.rangeService.getRange()
            // make full true 
            this.counterService = new CounterService(this.redisClient, res.range)
            const r2 = await this.counterService.getCount()
            if (!r2.success) throw 'error'
            return r2.inc
        }
        return r.inc
    }
}


export default ManagerService;

