// @ts-nocheck 
const {ManagerService} = require("../services/manager.service")
const { zkClient } = require("./setUpZookeeper")
const { redisClient } = require("../../redis");



const Manager = new ManagerService(zkClient,redisClient)

const setUpManager = async () => {
    console.log(` --- setting up manager -- `)
    await Manager.setUp()
    console.log(` --- manager set up ---`)
    // console.log(Manager)
}

module.exports = {
  Manager ,
   setUpManager 
}