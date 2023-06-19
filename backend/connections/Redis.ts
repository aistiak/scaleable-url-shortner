
import ConnectionInterface from "../server/interfaces/connection.interface";

class RedisConnection implements ConnectionInterface {

    constructor(){}

    async connect() {
        console.log(" ---- connecting to redis ---- ")
        throw new Error("Method not implemented.");
    }
}

export default RedisConnection