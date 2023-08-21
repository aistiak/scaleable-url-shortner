import express from 'express'
import RouterInterface from './server/interfaces/router.interface';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import Config from './server/config'
import ConnectionInterface from './server/interfaces/connection.interface';
import ManagerService from './server/services/manager.service'

/**
 * every dependeciy will be passed inside App , it will not initiate any 
 * 
*/
class App {

    // database 
    // redis 
    // zookeeper
    // manager - gets range 
    public app: express.Application;
    public port : number;
    public routes: Array<RouterInterface> = [];
    private dbConnection : ConnectionInterface ;
    private redisConnection : ConnectionInterface ;
    private zookeeperConnection : ConnectionInterface ;
    private managerService : ManagerService ;
    constructor(
        routes : Array<any>, 
        port : number = 3000 , 
        dbConnection : ConnectionInterface ,
        redisConnection : ConnectionInterface ,
        zookeeperConnection : ConnectionInterface ,
        managerService :ManagerService 
    ) {
        this.app = express()
        this.port = port
        this.routes = routes
        this.dbConnection = dbConnection
        this.redisConnection = redisConnection
        this.zookeeperConnection = zookeeperConnection 
        this.managerService = managerService
        this.init().then( res => {
            console.log(` -- setup complete --`)
        }).catch(e => {
            console.log(e)
            console.log(` --- error in setup ---`)
        })
    }

    private async init(){
        await this.dbConnection.connect()
        await this.redisConnection.connect()
        await this.zookeeperConnection.connect() 
        await this.managerService.setUp()
        this.app.use(cors({
            origin: Config.FRONTEND_URL,
            credentials: true
        }))
        this.app.use(cookieParser())
        this.routes.map((route) =>{
            this.app.use(route.router)
        })
    }
    public listen() {
        this.app.listen(this.port, () => {
            console.log(` --- server started on port ${this.port} ---`)
        })
    }
}

export default App;