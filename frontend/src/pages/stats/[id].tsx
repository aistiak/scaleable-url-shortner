import DashboardLayout from "@/layouts/dashboard";
import axios from "axios";
import Config from "config";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


import "chart.js/auto";

import { Bar, Line } from "react-chartjs-2";




function UrlStats() {
    const router = useRouter();
    const id = router.query?.id as string;
    const [data, setData] = useState({
        stats : [],
        deviceStats : []
    });


    const getLineChartData = () :any => {
        
        const labels =  data?.stats?.map( v => v?._id ) || [] // ["January", "February", "March", "April", "May", "June"];
        const t = {
            labels: labels,
            datasets: [
                {
                    label: "Date",
                    backgroundColor: "rgb(255, 99, 132)",
                    borderColor: "rgb(255, 99, 132)",
                    data: data?.stats?.map( v => v?.count ) || []
                },
            ],
        };

        return t;
    }
    const getBarChartData = () :any => {
        
        const labels =  data?.deviceStats?.map( v => v?._id?.device ) || [] // ["January", "February", "March", "April", "May", "June"];
        const t = {
            labels: labels,
            datasets: [
                {
                    label: "Device",
                    backgroundColor: "rgb(255, 99, 132)",
                    borderColor: "rgb(255, 99, 132)",
                    data: data?.deviceStats?.map( v => v?.count ) || []
                },
            ],
        };

        return t;
    }

    useEffect(() => {
        if(!id) return ;
        (async () => {
            try {
                const res1 = await axios({
                    url: `${Config.BACKEND_URL}/api/url/url-stats`,
                    method: `POST`,
                    withCredentials: true,
                    data: {
                        id
                    }
                })
                console.log({ res1 });
                setData(res1.data);
            } catch (e) {
                alert(`Could not load statistics`);
            }
        })();

    }, [id]);


    return (
        <DashboardLayout>
            <div>
                origianl url : {data?.url?.url}
            </div>
            <div>
                shortened url : { Config.FRONTEEND_DOMAIN  + '/' + Number(data?.url?.hash).toString(16)}
            </div>
            <div>
                total hits : { data?.url?.hits || 0}
            </div>
            <div>
                <Line data={getLineChartData()} />
            </div>
            <div>
                <Bar data={getBarChartData()} />
            </div>
        </DashboardLayout>
    )
}

export default UrlStats;