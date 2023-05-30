import {Router} from 'express'
import IndexRouter from './server/routers/index.router'
import IndexController from './server/controllers/index.controller'
const router = Router()

const routes : Array<any>= [
    new IndexRouter(router,'/', new IndexController())
]


export default routes ;