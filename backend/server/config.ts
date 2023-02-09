import dotenv from 'dotenv'

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

const Config = {
    GITHUB_OAUTH_CLIENT_ID: process.env.GITHUB_OAUTH_CLIENT_ID,
    GITHUB_OAUTH_CLIENT_SECRET: process.env.GITHUB_OAUTH_CLIENT_SECRET,
    EXPRESS_PORT: process.env.EXPRESS_PORT,
    FRONTEND_DOMAIN: process.env.FRONTEND_DOMAIN ,
    FRONTEND_URL: process.env.FRONTEND_URL ,
    MONGO_DB_URL : process.env.MONGO_DB_URL,
    COOKIE_NAME : process.env.COOKIE_NAME,
    JWT_SECRET : process.env.JWT_SECRET
}

export default Config 