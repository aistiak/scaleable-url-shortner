
const zk = require('node-zookeeper-client');
var crypto = require('crypto');
// console.log(zk)
const path = '/poc'


const client = zk.createClient('localhost:2181')

// console.log(client)


client.once('connected', function () {
    // start using the client
    console.log('client connected')
    // client.create(`${path}/${crypto.randomUUID()}`,Buffer.from("data"),zk.CreateMode.EPHEMERAL,function(err,path){
    //     if(err){
    //         console.log(err.stack)
    //         return
    //     }
    //     console.log(`path created = ${path}`)
    // })
    // client.getChildren(path,function(err,children,stats){
    //     if(err){
    //         console.log(err.stack)
    //         return 
    //     }
    //     console.log('children are' + children)
    // })
    
    
    // console.log(client.getChildren)
});
// client.init(config);
client.connect();
