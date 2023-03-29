
import Table from "@/components/table";
import DashboardLayout from "@/layouts/dashboard";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Dashboard() {

    return (
        <DashboardLayout>

            <Table />
            <ToastContainer />
        </DashboardLayout>
    )
}

export default Dashboard;

