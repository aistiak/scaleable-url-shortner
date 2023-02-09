import { model, Schema } from "mongoose";


interface IUrl {
    url : string ;
    hash : string ;
}

const UrlSchema = new Schema<IUrl>({
    url : {type: String , required : true} ,
    hash : {type : String , required : true}
});


export const UrlModel = model('url',UrlSchema) ;