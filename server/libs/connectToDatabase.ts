
import {connect} from 'mongoose';

export let MongoConnection :any  = null 

export const connectToDatabase = async () => {
    console.log(`--- trying to connect to databse ---`)
    MongoConnection = await connect('mongodb://localhost:27017')
    console.log(` --- connected to databse --- `)
}

