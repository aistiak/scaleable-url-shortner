// import dotenv from 'dotenv' 
// dotenv.config({path : `.env.${process.env.NODE_ENV}`})

const Config = {
    BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    GITHUB_OAUTH_CLIENT_ID: process.env.NEXT_PUBLIC_GITHUB_OAUTH_CLIENT_ID,

    GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    GOOGLE_OAUTH_REDIRECT_URL: process.env.GOOGLE_OAUTH_REDIRECT_URL

}


export default Config 