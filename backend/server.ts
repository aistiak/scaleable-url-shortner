import DBConnectionClass from "./DBConnectionClass";
import App from "./app";
import routes from "./routes";
import DBConnectionInterface from './server/interfaces/dbconnection.interface'

// database class 
const dbConnectionClass : DBConnectionInterface  = new DBConnectionClass() ;
// redis 
// zookeeper
// manager factory 
const app = new App(routes,4001,dbConnectionClass)

app.listen()