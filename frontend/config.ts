// import dotenv from 'dotenv' 
// dotenv.config({path : `.env.${process.env.NODE_ENV}`})

const Config = {
    BACKEND_URL : process.env.NEXT_PUBLIC_BACKEND_URL ,
    GITHUB_OAUTH_CLIENT_ID : process.env.NEXT_PUBLIC_GITHUB_OAUTH_CLIENT_ID
}


export default Config 