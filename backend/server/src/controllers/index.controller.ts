import { NextFunction , Request , Response} from "express";


class IndexController {

    constructor(){

    }

    public async get(req :Request , res : Response , next : NextFunction){

        return res.sendStatus(200);
    }
}

export default IndexController ;