
import { AppContext } from "@/app/page";
import Table from "@/components/table";
import DashboardLayout from "@/layouts/dashboard";

import { useContext, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {useRouter} from "next/navigation"

function Dashboard() {
   
    return (
        <DashboardLayout>

            <Table />
            <ToastContainer />
        </DashboardLayout>
    )
}

export default Dashboard;

