import { redisClient } from "../connections/redis"
import ManagerService from "../services/manager.service"
import RangeService from "../services/range.service";
import { zkClient } from "./setUpZookeeper"

const rangeService :any = new RangeService(zkClient,'/poc') ; // :todo 

export const Manager = new ManagerService(zkClient,redisClient,rangeService)

export const setUpManager = async () => {
    console.log(` --- setting up manager -- `)
    await Manager.setUp()
    console.log(` --- manager set up ---`)
    // console.log(Manager)
}

