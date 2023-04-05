# to see list of connected nodes in Zoo-Keeper
http://localhost:8080/commands/connections 

# packages


## how to run 
### with docker-compose 
just run `docker-compose up` 



### work process 
- when a new node connects to zk , it will fetch all the emphral nodes 
- emphaeal node will contain the currently being used range 
- available range will be detemined by cross matching empheral nodes and root node data 
- a server will store its count in redis 

### snaps

![image](https://user-images.githubusercontent.com/30620860/230019115-54e516fc-5843-410a-8e91-02d4cefff430.png)

![image](https://user-images.githubusercontent.com/30620860/230019054-698603d2-a324-4fe6-8a28-0d0785cd94e2.png)






