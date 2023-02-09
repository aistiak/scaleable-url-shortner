
// @ts-nocheck 

const zk = require('node-zookeeper-client');
var crypto = require('crypto');
// console.log(zk)
const path = '/poc'
const zkClient = zk.createClient('localhost:2181')

const setUpZookeeper = async function(){

    await zkClient.connect();
    console.log(` -- zookeeper connected --`)
}

module.exports = {
    setUpZookeeper,
    zkClient
}