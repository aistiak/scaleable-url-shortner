import { NextFunction } from "express";

import Config from "../config";
import querystring from 'querystring';
import axios from 'axios';
import UserModel from "../models/user.model";

import jwt from 'jsonwebtoken';export 

const JWT_SECRET = "secret"
class AuthController {

    public async index(req: any, res: any, next: NextFunction) {

        return res.sendStatus(200)
    }
    public async signInWithGithub(req: any, res: any, next: NextFunction) {
        try {
            console.log({ Config })
            const CLIENT_ID = Config.GITHUB_OAUTH_CLIENT_ID
            const CLIENT_SECRET = Config.GITHUB_OAUTH_CLIENT_SECRET

            console.log(req.query)
            const code = req.query.code
            console.log({ code })
            const res1 = await axios({
                url: 'https://github.com/login/oauth/access_token',
                method: 'POST',
                params: {
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                    code,

                }
            })
            console.log(res1.data)
            const parsed = querystring.parse(res1.data)
            // console.log({ parsed })
            const res2 = await axios({
                url: 'https://api.github.com/user/emails',
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${parsed.access_token}`
                }
            })
            console.log(res2.data[0])
            const data = res2.data[0]
            const email = data.email
            console.log({ email })
            let user = (await UserModel.findOne({ email }))?.toObject()
            if (!user) {
                console.log(` --- user not found creating new user ----`)
                const newUser = new UserModel({
                    name: '',
                    email,
                    urls: []
                })
                await newUser.save()
                user = newUser
            }
            console.log({ user })
            const token = jwt.sign({ user }, JWT_SECRET)
            // console.log({ token })
            res.cookie(Config.COOKIE_NAME, token, {
                httpOnly: true,
                domain: Config.FRONTEND_DOMAIN
            })
            return res.redirect(301, `${Config.FRONTEND_URL}/`)
        } catch (e) {
            next(e)
        }
    }


    public async signInWithGoogle(req: any, res: any, next: NextFunction) {
        try {
            console.log(req.query)
            const CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID
            const CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET
            const REDIRECT_URL = process.env.GOOGLE_OAUTH_REDIRECT_URL
            console.log({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code: req.query.code,
                grant_type: 'authorization_code',
                redirect_uri: REDIRECT_URL
            })
            const res1: any = await axios({
                url: `https://oauth2.googleapis.com/token`,
                method: `POST`,
                data: {
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                    code: req.query.code,
                    grant_type: 'authorization_code',
                    redirect_uri: REDIRECT_URL
                }
            })
            console.log(res1.data)
            console.log(res1.data.access_token)
            // @ts-ignore
            const email = jwt.decode(res1.data.id_token).email
            console.log({ email })
            const token = jwt.sign({ email }, JWT_SECRET)
            // console.log({ token })
            console.log({ token })
            res.cookie(Config.COOKIE_NAME, token, {
                httpOnly: true,
                domain: Config.FRONTEND_DOMAIN,
                sameSite: 'None'
            })
            return res.redirect(301, `${Config.FRONTEND_URL}/home`) // does not set cookie in ngrok
        } catch (e) {
            next(e)
        }
    }

    public async getUser(req: any, res: any, next: NextFunction) {
        try {
            // @ts-ignore
            const cookie = req.cookies?.[Config.COOKIE_NAME]
            // console.log({ cookie })
            if (!cookie) return res.sendStatus(401)
            const decode = jwt.verify(cookie, JWT_SECRET)
            return res.status(200).json(decode)
        } catch (e) {
            next(e)
        }
    }
    public async logout(req: any, res: any, next: NextFunction) {
        res.clearCookie(Config.COOKIE_NAME)// ,{domain : 'localhost',path : '/'})
        // res.cookie(Config.COOKIE_NAME, token, {
        //     httpOnly: true,
        //     domain: Config.FRONTEND_DOMAIN
        // })
        return res.sendStatus(200)
    }

}


export default AuthController;