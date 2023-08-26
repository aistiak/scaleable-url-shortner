import mongoose, { model, Schema } from "mongoose";



const UrlStats = new Schema({


},{
    timestamps: true ,
    strict : false 
});


export const UrlStatModel = model('url_stat',UrlStats) ;