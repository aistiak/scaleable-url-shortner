
const zk = require("node-zookeeper-client")
class RangeService {

    zkClient
    path
    constructor(zkClient, path) {
        this.zkClient = zkClient
        this.path = path
    }

    async getRange() {

        const zkClient = this.zkClient
        const path = this.path
        return new Promise((resolve, reject) => {
            // get root config 

            // get all empheal nodes 

            let available = []

            console.log(`getting data `)
            zkClient.getData(
                path,
                function (error, rawData, stat) {
                    console.log(`inside data `)

                    if (error) {
                        return resolve({ success: false, errors: ['error getting range'] })
                    }

                    const data = JSON.parse(rawData.toString())
                    console.log(data)
                    zkClient.getChildren(path, function (err, children, stats) {
                        if (err) {
                            console.log(err.stack)
                            return resolve({ success: false })
                        }
                        console.log('children are' + children)
                        console.dir(children)
                        console.log(data.ranges)
                        data.ranges.map((v) => {
                            if (!children.includes(v.id)) {
                                // @ts-ignore

                                available.push(v)
                            }
                        })
                        console.dir({ available })

                        if (available.length) {
                            const t = available[0]
                            // @ts-ignore
                            zkClient.create(`${path}/${t.id}`, Buffer.from('data'), zk.CreateMode.EPHEMERAL, function (err, path) {
                                if (err) {
                                    console.log(err)
                                    return resolve({ success: false })
                                }
                                // @ts-ignore
                                return resolve({ success: true, range: t.id })
                            })
                        } else {
                            console.log(` --- no more ranges are available ---`)
                            return resolve({ success: false })
                        }

                    })
                }
            )
            console.log(`got data `)


        })

    }

    async markRangeComplete(range) {

        const zkClient = this.zkClient
        const path = this.path
        return new Promise((resolve, reject) => {

            zkClient.getData(
                path,
                function (error, rawData, stat) {
                    if (error) {
                        return resolve({ success: false })
                    }
                    const data = JSON.parse(rawData.toString())

                    const newRanges = data.ranges.map((v) => {
                        if (v.id == range) {
                            return { ...v, full: true }
                        }
                        return v
                    });
                    data.ranges = newRanges
                    const bufferData = Buffer.from(JSON.stringify(data));
                    zkClient.setData(path, bufferData, function (err, stat) {
                        if (err) {
                            console.log(err)
                            return resolve({ success: false })
                        }
                        return resolve({ success: true })
                    })

                }
            )
        })
    }
}


module.exports = {
    RangeService
}