
import NewURL from "@/components/NewURL";
import Table from "@/components/table";
import DashboardLayout from "@/layouts/dashboard";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Dashboard() {
   
    return (
        <DashboardLayout>
            <NewURL/>
            <Table />
            <ToastContainer />
        </DashboardLayout>
    )
}

export default Dashboard;

