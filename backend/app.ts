import express from 'express'
import RouterInterface from './server/interfaces/router.interface';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import Config from './server/config'
import DBConnectionInterface from './server/interfaces/dbconnection.interface';
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
    private dbConnectionClass : DBConnectionInterface
    constructor(
        routes : Array<any>, 
        port : number = 3000 , 
        dbConnectionClass : DBConnectionInterface
    ) {
        this.app = express()
        this.port = port
        this.routes = routes
        this.dbConnectionClass = dbConnectionClass
        this.init()
    }

    private async init(){
        await this.dbConnectionClass.connect()
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