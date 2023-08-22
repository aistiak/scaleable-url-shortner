import { Router } from "express";
import AuthRouter from "./auth.router";
import AuthMiddleware from "../libs/AuthMiddleware";
import UrlRouter from "./url.router";
// import UrlRouter from "./url.router";




const AppRouter = Router();
AppRouter.use(AuthMiddleware)
AppRouter.use('/auth', AuthRouter);
AppRouter.use('/url', UrlRouter);

export default AppRouter;

