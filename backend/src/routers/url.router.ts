import { Router } from 'express';
import UrlController from '../controllers/url.controller';
import AuthMiddleware from '../libs/AuthMiddleware';
import JoiValidator from '../utils/JoiValidator';
import Joi from 'joi' ;

const UrlRouter = Router();

const urlController = new UrlController;

UrlRouter.post(`/find/:q`, urlController.findUrl);

UrlRouter.use(AuthMiddleware)

UrlRouter.get(`/`, urlController.index);
UrlRouter.get(`/shorten-url`, urlController.shortenUrl);
UrlRouter.get('/user-urls', urlController.getUserUrls);

UrlRouter.post(
    '/url-stats',
    JoiValidator(Joi.object().keys({
        id : Joi.string().required()
    })) ,
    urlController.getUrlStats 
);

export default UrlRouter;