import jwt from 'jsonwebtoken'
import Config from '../config'
import { JWT_SECRET } from '../router'

const AuthMiddleware  = (req : any,res : any,next:any) => {
    console.log(req.headers)
    const token = req.cookies?.[Config.COOKIE_NAME as string]
    console.log({token})
    try {
        const decode = jwt.verify(token,JWT_SECRET)
        // @ts-ignore
        req._user = decode?.user
        next() 
    }catch(error){
        return res.sendStatus(401)
    }
}

export default AuthMiddleware