
// @ts-nocheck 

const zk = require('node-zookeeper-client');
var crypto = require('crypto');
const { default: Config } = require('../config');
// console.log(zk)
const path = '/poc'
const zkClient = zk.createClient(Config.ZOOKEEPER_URL)

const setUpZookeeper = async function(){

    await zkClient.connect();
    console.log(` -- zookeeper connected --`)
}

module.exports = {
    setUpZookeeper,
    zkClient
}