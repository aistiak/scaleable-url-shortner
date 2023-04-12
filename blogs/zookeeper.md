# Apache Zookeeper,  what ? when ? and how ?

Imagine we have to application servers of the same or different application instances and they need to share some config data , each instance can modify the data and when it does the other need to be aware of the update .

so how can we acive this behaviour ! lets think

1. we could use a common databse , applications can read from and write changes to it , they will poll the databse at a certain interval to read the data and sync the changes 

2. we could use socketio . the applications will have their own socket clients and a seperate socket server which will host the config . Clients would read , push changes ang get notified when data changes via socket 

problesm with 1st approch 
- won`t get updates instantly 
- put extra load on the database by frequntly querying it 

problems with 2nd approch
- you need to setup a socket server from scratch 
- impelment logic on application level for data read and changes 
- availability issues , single point of failure 

now Introducing Apache Zookeeper which solves all the problem with both of the approch , 

## what is Zookeeper ?
it is a distributed config manager , a Distributed Coordination Service for Distributed Applications

## when do we use it ?
- when we need to share config or coordination data between applications 
- update config data 
- whtch for changes in data 

## concepts 

- you can think of it as a file directory tree like structure 
- so just like tree there are nodes and child nodes 
- a node can have both data and other child nodes
- nodes that contain data are called znodes
- ![image](https://user-images.githubusercontent.com/30620860/231446573-87581555-9bf3-4cd4-b320-0f6cc0f8494d.png)

- zookeeper data is kept on memory for low latancy 
- zookeeper is replicated 
- clients maintain a TPC connection with server to send , recive request and get updates 
- zookeeper marks each update with a number to reflect the order of sk transactions 
- every node in zookeeper is identified by a path 
(`/` being the root path/node)
- zookeeper has concept of empheral nodes these znodes exist as long as the session that the znode was created by is active . When session ends the znode is autometically deleted 
- zookeeper has watches , client can watch a znode for any changes 
- some simple API provided by zookeeper

```
create : creates a node at a location in the tree

delete : deletes a node

exists : tests if a node exists at a location

get data : reads the data from a node

set data : writes data to a node

get children : retrieves a list of children of a node

sync : waits for data to be propagated

```

## Hans on 
 we will be using docker for this 

 lets create a zookeeper container 
 ```
    docker run --name my-zk zookeeper:latest
 ```

 now lest enter into the container on a new termial 

 ```
    docker exec -it my-zk /bin/bash
 ```

we are going to use zkCli.sh to interact with the zookeeper server as a client , to enter the clinet 

```
/apache-zookeeper-3.8.0-bin/bin/zkCli.sh
```

create a node on zkCli termial 

```
create /test 

```

set data on node 

```
set /test "count=0"
```
or we could create and set data with a single command 

```
create /test "count=0"
```

now to retrieve the data 

```
get /test 
/* count=0 */ 
```

### watch for data change 

now lets open up a new terminal and enter the zookeeper cli
 ```
 docker exec -it my-zk /bin/bash
 ```
 watch for change in /test node 

```
addWatch /test
```
now on the previous termianl set new data for /test node , and we would see that the second termial reacted to the change 

```
set /test count=1
```
![image](https://user-images.githubusercontent.com/30620860/231446475-d264b211-af06-46d7-a2d6-9abccb22fcf3.png)

### References 
- https://zookeeper.apache.org/doc/r3.8.1/zookeeperOver.html 
- https://hub.docker.com/_/zookeeper


