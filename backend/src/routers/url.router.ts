import { Router } from 'express';
import UrlController from '../controllers/url.controller';
import AuthMiddleware from '../libs/AuthMiddleware';

const UrlRouter = Router();

const urlController = new UrlController;

UrlRouter.get(`/find/:q`, urlController.findUrl) ;
UrlRouter.use(AuthMiddleware)
UrlRouter.get(`/`, urlController.index) ;
UrlRouter.get(`/shorten-url`, urlController.shortenUrl) ;
UrlRouter.get('/user-urls', urlController.getUserUrls) ;

export default UrlRouter ;