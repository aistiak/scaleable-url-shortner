
import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import AuthMiddleware from "../libs/AuthMiddleware";


  
const AuthRouter = Router() ;

const authController = new AuthController()

AuthRouter.get('/',authController.index) ;
AuthRouter.get('/user',AuthMiddleware,authController.getUser) ;
AuthRouter.get('/logout',AuthMiddleware,authController.logout) ;
AuthRouter.get('/github',authController.signInWithGithub) ;
AuthRouter.get('/google',authController.signInWithGoogle) ;

export default AuthRouter ;

