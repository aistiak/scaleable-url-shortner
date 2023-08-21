import { Router } from 'express';
import UrlController from '../controllers/url.controller';

const UrlRouter = Router();

const urlController = new UrlController;

UrlRouter.get(`/shorten-url`, urlController.shortenUrl) ;
UrlRouter.get(`/:q`, urlController.findUrl) ;
UrlRouter.get(`/user-urls`, urlController.getUserUrls) ;

export default UrlRouter ;