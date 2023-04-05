// @ts-nocheck 
const { Router } = require("express");
const { redisClient } = require("./redis");
const { zkClient } = require("./libs/setUpZookeeper");
const { getCount } = require("./libs/getCount");
const { getServerRange } = require("./libs/getServerRange");
const { Manager } = require("./libs/initManager");
const { UrlModel } = require("./models/url.model");
import axios from 'axios';
import querystring from 'querystring';
import jwt from 'jsonwebtoken'
import Config from './config';
import UserModel from './models/user.model';
import AuthMiddleware from './libs/AuthMiddleware';
export const JWT_SECRET = "secret"


const router = new Router()
router.get(`/`, function (req, res, next) {

    return res.sendStatus(200);
})

// router.get('/set',async function(req,res,next){

//     // console.log(req.query)
//     const {key,val} = req.query
//     console.log(req.query)
//     await redisClient.set(req.query.key,req.query.val)
//     return res.sendStatus(200)
// })

// router.get('/get',async function(req,res,next){
//     console.log(req.query.key)
//     const val = await redisClient.get(req.query.key)
//     return res.status(200).json({val})
// })

// router.get(`/config`,function(req,res,next){


//     zkClient.getData('/poc',function(err, data, stat){
//         if(err){
//             return res.status(400).json({})
//         }
//         console.log(data)
//         return res.status(200).json(JSON.parse(data.toString()))
//     })
//     // return config ;
// })

// router.get('/count',async (req,res,next)=>{
//     try {
//         const inc = await Manager.getCount()
//         const hex = Number(inc).toString(16)
//         console.log(inc,hex)
//         return res.status(200).json({inc:hex})
//     }catch(err){
//         next(err)
//     }
// })

router.get(`/srt-url`, AuthMiddleware, async (req, res, next) => {
    try {

        const { u = '' } = req.query
        console.log({ u })
        const inc = await Manager.getCount()
        const hash = Number(inc).toString(16)
        const url = new UrlModel({
            url: u,
            hash: inc,
            user: req._user._id
        })
        await url.save()
        await UserModel.findOneAndUpdate(req._user._id, {
            $push: {
                // @ts-ignore
                urls: url._id
            }
        })
        return res.status(200).json(url)
    } catch (error) {
        console.log(error)
        next(error)
    }
})
router.get(`/:q`, async (req, res, next) => {
    try {

        const { q = '' } = req.params
        console.log({ q })
        const url = (await UrlModel.findOne({ hash: q }))?.toObject()
        console.log(url)
        if (!url) return res.sendStatus(404)
        // return res.redirect(301, url.url)
        return res.status(200).json(url)
    } catch (error) {
        next(error)
    }
})


router.get(`/api/auth/github`, async (req, res, next) => {

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
    } catch (error) {
        next(error)
    }
})

router.get(`/api/auth/google`, async (req, res, next) => {
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
        const res1 = await axios({
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
    } catch (error) {
        console.log(error?.response)
        next(error)
    }
})


router.get(`/test/auth`, AuthMiddleware, (req, res, next) => {
    return res.status(200).json({})
})
router.get(`/api/user`, AuthMiddleware, (req, res, next) => {
    try {
        const cookie = req.cookies?.[Config.COOKIE_NAME]
        // console.log({ cookie })
        if (!cookie) return res.sendStatus(401)
        const decode = jwt.verify(cookie, JWT_SECRET)
        return res.status(200).json(decode)
    } catch (error) {
        next(error)
    }
})

router.get(`/api/logout`, (req, res, next) => {
    res.clearCookie(Config.COOKIE_NAME)// ,{domain : 'localhost',path : '/'})
    // res.cookie(Config.COOKIE_NAME, token, {
    //     httpOnly: true,
    //     domain: Config.FRONTEND_DOMAIN
    // })
    return res.sendStatus(200)
})


router.get(`/api/user/urls`, AuthMiddleware, async (req, res, next) => {
    try {
        // const { perPage = 10, currentPage = 1, } = req.query;
        const user = (await UserModel.findById(req._user._id))?.toObject()
        // const skip = (currentPage - 1) * perPage;
        const totalItems = user?.urls.length || 0

        console.log(user.urls)
        const urls = await UrlModel.find({
            _id: {
                $in: user?.urls
            }
        }).sort({createdAt : -1})
        // .skip(skip).limit(perPage)

        return res.status(200).json({ 
            urls, 
            // currentPage, 
            // perPage, 
            totalItems 
        })
    } catch (error) {
        next(error)
    }
})

module.exports = {
    router
}