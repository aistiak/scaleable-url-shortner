import DBConnection from "./connections/Database";
import App from "./app";
import routes from "./routes";
import ConnectionInterface from './server/interfaces/connection.interface'
import RedisConnection from "./connections/Redis";
import ZookeeperConnection from "./connections/Zookeeper";
import ManagerService from "./server/services/manager.service";
import RangeService from "./server/services/range.service";
// database class 
export const dbConnection: ConnectionInterface = new DBConnection();
// redis 
export const redisConnection: ConnectionInterface = new RedisConnection();
// zookeeper
export const zookeeperConnection: ConnectionInterface = new ZookeeperConnection();
// manager factory 
const PATH = "/data"
const rangeService = new RangeService(zookeeperConnection, PATH)
export const managerService = new ManagerService(zookeeperConnection, redisConnection, rangeService)

const app = new App(
    routes,
    4001,
    dbConnection,
    redisConnection,
    zookeeperConnection,
    managerService
)

app.listen()