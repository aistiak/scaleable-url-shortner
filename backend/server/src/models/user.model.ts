import mongoose, { model, Schema } from "mongoose";



const userModelSchema = new Schema({
    name : {
        type : String ,
        required : false ,
        trim : true
    },
    email : {
        required : true ,
        type : String ,
        unique : true 
    },
    urls : [
        {
            type : mongoose.Types.ObjectId ,
            ref : 'url'
        }
    ]
},{strict:false});

const UserModel = model('user',userModelSchema) ;

export default UserModel ;