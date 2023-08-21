
import {connect} from 'mongoose';
import Config from '../configs';


export let MongoConnection :any  = null 

export const connectToDatabase = async () => {
    try {
        console.log(`--- trying to connect to databse ---`)
        console.dir({Config})
        MongoConnection = await connect(Config.MONGO_DB_URL as string)
        console.log(` --- connected to databse --- `)
    }catch(e){
        console.log(` -- failed to connect to database --`)
    }

}

