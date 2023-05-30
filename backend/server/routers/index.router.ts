import { Router } from "express";
import RouterInterface from "../interfaces/router.interface";


class IndexRouter implements RouterInterface{
    public router: Router ;
    public path: string  ;
    public controller : any ;
    constructor(router : Router , path : string, controller : any) {
        this.router = router 
        this.path = path 
        this.controller = controller 
        this.init()
    }
    
    private init(){
        this.router.get('/',this.controller.get)
    }
}

export default IndexRouter ;