import DBConnectionInterface from "./server/interfaces/dbconnection.interface";
import { connect } from 'mongoose';
import Config from './server/config';

class DBConnectionClass implements DBConnectionInterface {

    async connect() {
        console.log(` -- connecting to database -- `)
        await connect("mongodb://localhost:27017")
        console.log(` -- connected to database -- `)
    }
}

export default DBConnectionClass