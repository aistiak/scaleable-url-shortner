import mongoose, { model, Schema } from "mongoose";


// interface IUrl {
//     url : string ;
//     hash : string ;
   
// }

const UrlSchema = new Schema({
    url : {type: String , required : true} ,
    hash : {type : String , required : true},
    user : {
        type : mongoose.Types.ObjectId ,
        ref : 'user'
    }
});


export const UrlModel = model('url',UrlSchema) ;