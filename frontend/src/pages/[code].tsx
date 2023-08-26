"use client"
import axios from "axios";
import Config from "config";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import NotFoundPage from "./NofFound";


const Test = () => {

    /**
     * get the code 
     * api call to get detail and redirec to page
     * if not found 404 page 
    */
    const [notFound, setNotFound] = useState(false)
    const router = useRouter()
    const code = parseInt(router.query?.code as string, 16)

    useEffect(() => {
        (async () => {
            try {

                console.log(router.query)
                console.log({ code })
                if (!code) return;

                const os = navigator.platform;
                const browserInfo = navigator.userAgent;
                let device = 'etc';
                const userAgent = navigator.userAgent;
                if (userAgent.match(/Mobile/i)) {
                    console.log("Device: Mobile");
                    device = 'mobile'
                } else if (userAgent.match(/Tablet/i)) {
                    console.log("Device: Tablet");
                    device = 'tablet'
                } else {
                    console.log("Device: Desktop");
                    device = 'desktop'
                }

                const currentTime = (new Date()).toLocaleTimeString();
                const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                const res1 = await axios({
                    url: `${Config.BACKEND_URL}/api/url/find/${code}`,
                    method: `POST`,
                    // withCredentials : true ,
                    data: {
                        os,
                        browserInfo,
                        userAgent,
                        device,
                        currentTime,
                        userTimezone
                    }
                })
                console.log(res1.data)
                window.location.href = res1.data.url
            } catch (error) {
                console.log(error)
                setNotFound(true)
            }

        })()
    }, [code])
    return (
        <div>

            {notFound && <NotFoundPage />}
        </div>
    )
}


export default Test;