// @ts-nocheck 
const {ManagerService} = require("../services/manager.service")
const { zkClient } = require("./setUpZookeeper")
const { redisClient } = require("../redis");



const Manager = new ManagerService(zkClient,redisClient)

const setUpManager = async () => {
    await Manager.setUp()
}

module.exports = {
  Manager ,
   setUpManager 
}