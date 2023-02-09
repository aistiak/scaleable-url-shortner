const zookeeper = require("node-zookeeper-client")
const crypto = require('crypto')
zkClient = zookeeper.createClient("localhost:2181")


const path = '/poc'
zkClient.once('connected', async function () {
    console.log(` connected to zookeeper `)
    // get config
    zkClient.getData(path, function (err, data, stat) {
        console.log()
        const config = JSON.parse(data)
        zkClient.getChildren(path, function (err, children, stat) {
            console.log('children')
            console.log(children)
            console.log(`total ${children.length}`)
            zkClient.create(`${path}/${crypto.randomUUID()}`, Buffer.from("data"), zookeeper.CreateMode.EPHEMERAL, function (err, path) {
                if (err) {
                    console.log(err.stack)
                    return
                }
                console.log(`path created = ${path}`)
            })
        })
    })
})

zkClient.connect()