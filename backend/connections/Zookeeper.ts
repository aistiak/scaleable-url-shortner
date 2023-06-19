
import ConnectionInterface from "../server/interfaces/connection.interface";

class ZookeeperConnection implements ConnectionInterface {

    constructor(){}

    async connect() {
        throw new Error("Method not implemented.");
    }
}

export default ZookeeperConnection