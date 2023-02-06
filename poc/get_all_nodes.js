var zk = require("node-zookeeper-client")


const client = zk.createClient("localhost:2181")

const path = '/poc'
client.once('connected',function(){
    // if(err){
    //     console.log(` error connecting`)
    // }
    console.log(` --- connected --- `)
    client.getChildren(path,function(err,children,stat){
        console.log('children')
        console.log(children)
        console.log(`total ${children.length}`)
    })
})
client.connect()