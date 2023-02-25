
import {connect} from 'mongoose';
import Config from '../config';

export let MongoConnection :any  = null 

export const connectToDatabase = async () => {
    console.log(`--- trying to connect to databse ---`)
    console.dir({Config})
    MongoConnection = await connect(Config.MONGO_DB_URL as string)
    console.log(` --- connected to databse --- `)
}

