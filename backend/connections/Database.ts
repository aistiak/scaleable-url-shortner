import ConnectionInterface from "../server/interfaces/connection.interface";
import { connect } from 'mongoose';
import Config from '../server/config';

class DBConnection implements ConnectionInterface {

    async connect() {
        console.log(` -- connecting to database -- `)
        await connect("mongodb://localhost:27017")
        console.log(` -- connected to database -- `)
    }
}

export default DBConnection