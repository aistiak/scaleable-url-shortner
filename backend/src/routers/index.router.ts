import { Router } from "express";
import AuthRouter from "./auth.router";
import AuthMiddleware from "../libs/AuthMiddleware";
import UrlRouter from "./url.router";
// import UrlRouter from "./url.router";




const AppRouter = Router();

AppRouter.use('/url', UrlRouter);
AppRouter.use('/auth', AuthRouter);

export default AppRouter;

