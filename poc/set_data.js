var zookeeper = require('node-zookeeper-client');


var client = zookeeper.createClient('localhost:2181');
var path = "/poc";
const config = {
  ranges : [
    {
        id : '1005_1010' ,
        from : 1005 ,
        to : 1010,
        full : false
    },
    {
        id : '1011_1016' ,
        from : 1011 ,
        to : 1016 ,
        full : false
    },
    {
        id : '1017_1022' ,
        from : 1017 ,
        to : 1022 ,
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