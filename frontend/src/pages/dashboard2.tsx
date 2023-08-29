"use client"

import { AppContext } from "@/app/page";
import { useContext, useEffect, useState } from "react";
import axios from 'axios';
import Config from "config";

function checkUrl(string: string) {
    let givenURL;
    try {
        givenURL = new URL(string);
    } catch (error) {
        console.log("error is", error);
        return false;
    }
    return true;
}

const DashboardPage = () => {

    // @ts-ignore
    const { context, setContext } = useContext(AppContext)
    const [inp, setInp] = useState('')
    const [urls, setUrls] = useState([])
    useEffect(() => {
        (async () => {
            try {
                const res1 = await axios({
                    url: `${Config.BACKEND_URL}/api/url/user-urls`,
                    method: `GET`,
                    withCredentials: true
                })
                console.dir(res1.data.urls)
                setUrls(res1.data.urls)
            }catch(error){
                console.log(error)
            }

        })()
    }, [])
    return (
        <div>
            <div>
                this is dashboard page <br />
                user : {context?.user?.email}
            </div>
            <div>
                <button onClick={
                    () => {
                        axios({
                            url: `${Config.BACKEND_URL}/api/auth/logout`,
                            method: 'GET',
                            withCredentials: true, // without this wont log out
                        })
                        setContext({ user: null })
                    }
                }> logout</button>
            </div>
            <div>
                <input type="text" onChange={(e) => setInp(e.target.value
                )} />
                <br />
                <button onClick={async () => {
                    try {
                        if (!checkUrl(inp)) {
                            alert(`enter valid url`)
                            return
                        }
                        const res1 = await axios({
                            url: `${Config.BACKEND_URL}/srt-url`,
                            method: 'GET',
                            withCredentials: true,
                            params: {
                                u: inp
                            }
                        })
                        console.log(res1.data)
                        // @ts-ignore
                        setUrls([res1.data, ...urls])
                    } catch (error) {

                        console.log(error)
                    }

                }} >short url </button>
            </div>
            <div>
                <h2>

                    list of user urls

                    {
                        urls.map((url) => (
                            <div>
                                {/* @ts-ignore */}
                                {url?.url} - {`${Config.FRONTEEND_DOMAIN}/${Number(url?.hash)?.toString(16)}`}
                            </div>
                        ))
                    }
                </h2>
            </div>
        </div>
    )
};


export default DashboardPage