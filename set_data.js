var zookeeper = require('node-zookeeper-client');


var client = zookeeper.createClient('localhost:2181');
var path = "/poc";
const config = {
  ranges : [
    {
        id : '100_200' ,
        from : 100 ,
        to : 200 ,
        full : false
    },
    {
        id : '201_300' ,
        from : 201 ,
        to : 300 ,
        full : false
    },
    {
        id : '301_400' ,
        from : 301 ,
        to : 400 ,
        full : false
    }
  ]
}
var data = Buffer.from(JSON.stringify(config));

client.once('connected', function () {
    console.log('Connected to the server.');

    client.setData(path, data, function (error, stat) {
        if (error) {
            console.log('Got error when setting data: ' + error);
            return;
        }

        console.log(
            'Set data "%s" on node %s, version: %d.',
            data.toString(),
            path,
            stat.version
        );
        client.close();
    });
});

client.connect();