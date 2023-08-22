
import { Router } from "express";
import AuthController from "../controllers/auth.controller";


  
const AuthRouter = Router() ;

const authController = new AuthController()

AuthRouter.get('/',authController.index) ;
AuthRouter.get('/user',authController.getUser) ;
AuthRouter.get('/logout',authController.logout) ;
AuthRouter.get('/github',authController.signInWithGithub) ;
AuthRouter.get('/google',authController.signInWithGoogle) ;

export default AuthRouter ;

