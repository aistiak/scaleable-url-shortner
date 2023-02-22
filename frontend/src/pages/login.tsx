"use client"
import { useContext, useEffect, useState } from "react"
import axios from 'axios';
import { Cookies } from 'react-cookie'
import Config from "config";
import { AppContext } from "@/app/page";

export default function LoginPage() {
    /* github */
    const GITHUB_CLIENT_ID = Config.GITHUB_OAUTH_CLIENT_ID
    const BACKEND_URL = Config.BACKEND_URL
    const GITHUB_REDIRECT_URI = `${Config.BACKEND_URL}/api/auth/github`

    /*google*/

    const googleOauthQueryParams = {
        client_id: Config.GOOGLE_OAUTH_CLIENT_ID as string,
        redirect_uri: Config.GOOGLE_OAUTH_REDIRECT_URL as string,
        response_type: 'code',
        scope: ['https://www.googleapis.com/auth/userinfo.email'].join(' ')
    }
    const GOOGLE_OAUTH_QUERY_STRING = new URLSearchParams(googleOauthQueryParams)
    const GOOGLE_OAUTH_URL = `https://accounts.google.com/o/oauth2/auth?${GOOGLE_OAUTH_QUERY_STRING.toString()}`

    // const [user, setUser] = useState(null)
    // @ts-ignore
    const { context, setContext } = useContext(AppContext)
    useEffect(() => {
        (async () => {
            try {
                console.log({ Config })
                const res = await axios({
                    url: `${BACKEND_URL}/api/user`,
                    method: 'GET',
                    withCredentials: true
                })
                console.log(res.data)
                // setUser(res.data)
                setContext(res.data)

            } catch (error) {
                console.log(error)
            }
        })();
    }, []);
    return (
        <div>
            {
                !context?.user &&
                <div>
                    <div>
                        <a href={`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_url=${GITHUB_REDIRECT_URI}&scope=user`} >
                            login with github
                        </a>

                    </div>
                    <div>
                        <a href={GOOGLE_OAUTH_URL}>
                            login with google
                        </a>
                    </div>
                </div>
            }
        </div>
    )
} 