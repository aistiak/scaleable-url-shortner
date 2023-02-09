"use client"
import { useEffect, useState } from "react"
import axios from 'axios';
import { Cookies } from 'react-cookie'
import Config from "config";

export default function HomePage() {
    const CLIENT_ID = Config.GITHUB_OAUTH_CLIENT_ID
    const BACKEND_URL = Config.BACKEND_URL
    const REDIRECT_URI = `${Config.BACKEND_URL}/api/auth/github`
    // const CLIENT_ID = Config.GITHUB_OAUTH_CLIENT_ID
    // const REDIRECT_URI = "http://localhost:4002/api/auth/github"

    const [user, setUser] = useState(null)
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
                setUser(res.data)

            } catch (error) {
                console.log(error)
            }
        })();
    }, [Config]);
    return (
        <div>
            {
                !user ?
                    <div>
                        <div>
                            <a href={`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_url=${REDIRECT_URI}&scope=user`} >
                                login with github
                            </a>

                        </div>
                    </div> : <div>
                        {/* @ts-ignore */}
                        welcome {user?.login}<br />
                        <button onClick={
                            () => {
                                setUser(null)
                                axios({
                                    url: `${Config.BACKEND_URL}/api/logout`,
                                    method: 'GET',
                                    withCredentials: true, // without this wont log out
                                })
                            }
                        }> logout</button>
                    </div>
            }
        </div>
    )
} 