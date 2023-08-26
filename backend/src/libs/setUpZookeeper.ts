
// @ts-nocheck 

import Config from "../config";

const zk = require('node-zookeeper-client');
var crypto = require('crypto');

console.log({Config})
// console.log(zk)
const path = '/poc'
export const zkClient = zk.createClient(Config.ZOOKEEPER_URL)

export const setUpZookeeper = async function(){

    await zkClient.connect();
    console.log(` -- zookeeper connected --`)
}

