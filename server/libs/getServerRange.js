const { zkClient, setUpZookeeper } = require("./setUpZookeeper")
const zk = require("node-zookeeper-client")
const crypto = require("crypto")
const getServerRange = async (zkClient, path) => {


    // get root config 

    // get all empheal nodes 

    const available = []

    console.log(`getting data `)
    zkClient.getData(
        path,
        function (error, rawData, stat) {
            console.log(`inside data `)

            if (error) { throw 'error getting range' }

            const data = JSON.parse(rawData.toString())
            console.log(data)
            zkClient.getChildren(path, function (err, children, stats) {
                if (err) {
                    console.log(err.stack)
                    return
                }
                console.log('children are' + children)
                console.dir(children)
                console.log(data.ranges)
                data.ranges.map((v) => {
                    if (!children.includes(v.id)) {
                        available.push(v)
                    }
                })
                console.dir({ available })

                if (available.length) {
                    const t = available[0]
                    zkClient.create(`${path}/${t.id}`, Buffer.from('data'), zk.CreateMode.EPHEMERAL, function (err, path) {
                        if (err) {
                            console.log(err)
                            return
                        }
                    })
                }else {
                    console.log(` --- no more ranges are available ---`)
                }

            })
        }
    )
    console.log(`got data `)



}

module.exports = {

    getServerRange
};

(async () => {

    await setUpZookeeper()

    await getServerRange(zkClient, '/poc')
})()