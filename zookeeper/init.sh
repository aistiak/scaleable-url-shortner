/apache-zookeeper-3.8.0-bin/bin/zkServer.sh start #-foreground
# exec /docker-entrypoint.sh

# $config = "{\"ranges\":[{\"id\":\"1005_1999\",\"from\":1005,\"to\":1999,\"full\":false},{\"id\":\"2011_2999\",\"from\":2011,\"to\":2999,\"full\":false},{\"id\":\"3017_3999\",\"from\":3017,\"to\":3999,\"full\":false}]}"
/apache-zookeeper-3.8.0-bin/bin/zkCli.sh create /poc 
/apache-zookeeper-3.8.0-bin/bin/zkCli.sh set /poc "{\"ranges\":[{\"id\":\"1005_1999\",\"from\":1005,\"to\":1999,\"full\":false},{\"id\":\"2011_2999\",\"from\":2011,\"to\":2999,\"full\":false},{\"id\":\"3017_3999\",\"from\":3017,\"to\":3999,\"full\":false}]}"

tail -f /dev/null 