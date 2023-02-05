# to see list of connected nodes 
http://localhost:8080/commands/connections 

# packages

## docker 
### run zookeeper 
> docker run --name some-zookeeper -p 2181:2181 -p 8080:8080 -d zookeeper 

### redis 
> docker run --name some-redis -p 6379:6379 -d redis 



### work process 
- when a new node connects to zk , it will fetch all the emphral nodes 
- emphaeal node will contain the currently being used range 
- available range will be detemined by cross matching empheral nodes and root node data 
- a server will store its count in redis 