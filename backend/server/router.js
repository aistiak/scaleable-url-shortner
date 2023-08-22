"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = void 0;
// @ts-nocheck 
const { Router } = require("express");
const { redisClient } = require("./redis");
const { zkClient } = require("./libs/setUpZookeeper");
const { getCount } = require("./libs/getCount");
const { getServerRange } = require("./libs/getServerRange");
const { Manager } = require("./libs/initManager");
const { UrlModel } = require("./models/url.model");
const axios_1 = __importDefault(require("axios"));
const querystring_1 = __importDefault(require("querystring"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("./src/config"));
const user_model_1 = __importDefault(require("./src/models/user.model"));
const AuthMiddleware_1 = __importDefault(require("./src/libs/AuthMiddleware"));
exports.JWT_SECRET = "secret";
const router = new Router();
router.get(`/`, function (req, res, next) {
    return res.sendStatus(200);
});
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
router.get(`/srt-url`, AuthMiddleware_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { u = '' } = req.query;
        console.log({ u });
        const inc = yield Manager.getCount();
        const hash = Number(inc).toString(16);
        const url = new UrlModel({
            url: u,
            hash: inc,
            user: req._user._id
        });
        yield url.save();
        yield user_model_1.default.findOneAndUpdate(req._user._id, {
            $push: {
                // @ts-ignore
                urls: url._id
            }
        });
        return res.status(200).json(url);
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}));
router.get(`/:q`, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // date , user agent , device , time , location 
        const { q = '' } = req.params;
        console.log({ q });
        const url = (_a = (yield UrlModel.findOne({ hash: q }))) === null || _a === void 0 ? void 0 : _a.toObject();
        console.log(url);
        if (!url)
            return res.sendStatus(404);
        // return res.redirect(301, url.url)
        return res.status(200).json(url);
    }
    catch (error) {
        next(error);
    }
}));
router.get(`/api/auth/github`, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        console.log({ Config: config_1.default });
        const CLIENT_ID = config_1.default.GITHUB_OAUTH_CLIENT_ID;
        const CLIENT_SECRET = config_1.default.GITHUB_OAUTH_CLIENT_SECRET;
        console.log(req.query);
        const code = req.query.code;
        console.log({ code });
        const res1 = yield (0, axios_1.default)({
            url: 'https://github.com/login/oauth/access_token',
            method: 'POST',
            params: {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code,
            }
        });
        console.log(res1.data);
        const parsed = querystring_1.default.parse(res1.data);
        // console.log({ parsed })
        const res2 = yield (0, axios_1.default)({
            url: 'https://api.github.com/user/emails',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${parsed.access_token}`
            }
        });
        console.log(res2.data[0]);
        const data = res2.data[0];
        const email = data.email;
        console.log({ email });
        let user = (_b = (yield user_model_1.default.findOne({ email }))) === null || _b === void 0 ? void 0 : _b.toObject();
        if (!user) {
            console.log(` --- user not found creating new user ----`);
            const newUser = new user_model_1.default({
                name: '',
                email,
                urls: []
            });
            yield newUser.save();
            user = newUser;
        }
        console.log({ user });
        const token = jsonwebtoken_1.default.sign({ user }, exports.JWT_SECRET);
        // console.log({ token })
        res.cookie(config_1.default.COOKIE_NAME, token, {
            httpOnly: true,
            domain: config_1.default.FRONTEND_DOMAIN
        });
        return res.redirect(301, `${config_1.default.FRONTEND_URL}/`);
    }
    catch (error) {
        next(error);
    }
}));
router.get(`/api/auth/google`, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.query);
        const CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID;
        const CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
        const REDIRECT_URL = process.env.GOOGLE_OAUTH_REDIRECT_URL;
        console.log({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code: req.query.code,
            grant_type: 'authorization_code',
            redirect_uri: REDIRECT_URL
        });
        const res1 = yield (0, axios_1.default)({
            url: `https://oauth2.googleapis.com/token`,
            method: `POST`,
            data: {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code: req.query.code,
                grant_type: 'authorization_code',
                redirect_uri: REDIRECT_URL
            }
        });
        console.log(res1.data);
        console.log(res1.data.access_token);
        const email = jsonwebtoken_1.default.decode(res1.data.id_token).email;
        console.log({ email });
        const token = jsonwebtoken_1.default.sign({ email }, exports.JWT_SECRET);
        // console.log({ token })
        console.log({ token });
        res.cookie(config_1.default.COOKIE_NAME, token, {
            httpOnly: true,
            domain: config_1.default.FRONTEND_DOMAIN,
            sameSite: 'None'
        });
        return res.redirect(301, `${config_1.default.FRONTEND_URL}/home`); // does not set cookie in ngrok
    }
    catch (error) {
        console.log(error === null || error === void 0 ? void 0 : error.response);
        next(error);
    }
}));
router.get(`/test/auth`, AuthMiddleware_1.default, (req, res, next) => {
    return res.status(200).json({});
});
router.get(`/api/user`, AuthMiddleware_1.default, (req, res, next) => {
    var _a;
    try {
        const cookie = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a[config_1.default.COOKIE_NAME];
        // console.log({ cookie })
        if (!cookie)
            return res.sendStatus(401);
        const decode = jsonwebtoken_1.default.verify(cookie, exports.JWT_SECRET);
        return res.status(200).json(decode);
    }
    catch (error) {
        next(error);
    }
});
router.get(`/api/logout`, (req, res, next) => {
    res.clearCookie(config_1.default.COOKIE_NAME); // ,{domain : 'localhost',path : '/'})
    // res.cookie(Config.COOKIE_NAME, token, {
    //     httpOnly: true,
    //     domain: Config.FRONTEND_DOMAIN
    // })
    return res.sendStatus(200);
});
router.get(`/api/user/urls`, AuthMiddleware_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        // const { perPage = 10, currentPage = 1, } = req.query;
        const user = (_c = (yield user_model_1.default.findById(req._user._id))) === null || _c === void 0 ? void 0 : _c.toObject();
        // const skip = (currentPage - 1) * perPage;
        const totalItems = (user === null || user === void 0 ? void 0 : user.urls.length) || 0;
        console.log(user.urls);
        const urls = yield UrlModel.find({
            _id: {
                $in: user === null || user === void 0 ? void 0 : user.urls
            }
        }).sort({ createdAt: -1 });
        // .skip(skip).limit(perPage)
        return res.status(200).json({
            urls,
            // currentPage, 
            // perPage, 
            totalItems
        });
    }
    catch (error) {
        next(error);
    }
}));
module.exports = {
    router
};
