import jwt from 'jsonwebtoken'


import Config from '../configs'
import { JWT_SECRET } from '../controllers/auth.controller'


const AuthMiddleware  = (req : any,res : any,next:any) => {
    console.log(req.headers)
    // @ts-ignore
    const token = req.cookies?.[Config.COOKIE_NAME]
    console.log({token})
    try {
        const decode = jwt.verify(token,JWT_SECRET)
        // @ts-ignore
        req._user = decode?.user
        next() 
    }catch(error){
        console.log(error)
        return res.sendStatus(401)
    }
}

export default AuthMiddleware