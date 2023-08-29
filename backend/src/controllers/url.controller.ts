import { NextFunction } from "express";
import UserModel from "../models/user.model";
import { UrlModel } from "../models/url.model";
import { Manager } from "../libs/initManager";
import { UrlStatModel } from "../models/stats.model";
import dayjs from 'dayjs'
const { ObjectId } = require('mongoose');

class UrlController {

    public index(req: any, res: any, next: NextFunction) {

        return res.sendStatus(200);
    }
    public async getUserUrls(req: any, res: any, next: NextFunction) {
        try {
            // const { perPage = 10, currentPage = 1, } = req.query;
            const user = await UserModel.findById(req._user._id).lean()
            // const skip = (currentPage - 1) * perPage;
            const totalItems = user?.urls.length || 0
            const urls = await UrlModel.find({
                _id: {
                    $in: user?.urls
                }
            }).sort({ createdAt: -1 })
            // .skip(skip).limit(perPage)

            return res.status(200).json({
                urls,
                // currentPage, 
                // perPage, 
                totalItems
            })
        } catch (e) {
            next(e)
        }
    }


    public async shortenUrl(req: any, res: any, next: NextFunction) {
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
        } catch (e) {
            next(e)
        }
    }

    public async findUrl(req: any, res: any, next: NextFunction) {
        try {
            type ReqBody = {
                os: string;
                browserInfo: string;
                userAgent: string;
                device: string;
                currentTime: string;
                userTimezone: string;
            }
            // date , user agent , device , time , location 
            const { q = '' } = req.params
            console.log({ q })
            const url = await UrlModel.findOne({ hash: q }).lean();
            console.log(url)
            if (!url) return res.sendStatus(404)
            // return res.redirect(301, url.url)
            // store stat 
            console.log({
                'req.body': req.body
            })
            const {
                os,
                userAgent,
                device,
                currentTime,
                userTimezone
            } = req.body as ReqBody;

            const urlStat = new UrlStatModel({
                url: url.url,
                hash: url.hash,
                urlOf: url.user,
                statOf: url._id,
                os,
                userAgent,
                device,
                currentTime: dayjs(currentTime).toDate(),
                userTimezone
            });
            await urlStat.save();

            let hits = url?.hits ?? 0;
            hits += 1;
            await UrlModel.findOneAndUpdate({ hash: url.hash }, {
                hits,
            });

            return res.status(200).json(url)
        } catch (e) {
            next(e)
        }
    }

    public async getUrlStats(req: any, res: any, next: NextFunction) {
        try {
            const { id } = req.body; // url id 
            // const url = await UrlModel.findById(id).lean() ;
            const query = {

                statOf: id
            };

            const url = await UrlModel.findById(id).lean() ;
            // const stats = await UrlStatModel.find(query);

            const stats = await UrlStatModel.aggregate([
                { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$currentTime' } }, count: { $sum: 1 } } },
                { $sort: { _id: 1 } }
            ]);
            const deviceStats = await UrlStatModel.aggregate([
                { $group: { _id: { device: '$device' }, count: { $sum: 1 } } },
                { $sort: { '_id.date': 1, count: -1 } }
            ]);
            return res.status(200).json({ stats , deviceStats, url});

        } catch (e) {
            next(e)
        }
    }
}

export default UrlController;
