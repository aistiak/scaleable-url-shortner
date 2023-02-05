const zk = require('zookeeper') ;

console.log(zk)

const config = {
    connect: 'localhost:2181',
    timeout: 5000,
    debug_level: zk.ZOO_LOG_LEVEL_WARN,
    host_order_deterministic: false,
};
function createClient() {

    return new zk(config);
}

const client = createClient();

console.log(client)

client.on('connect', () => {
    // start using the client
    console.log('client connected')
});

client.init(config);