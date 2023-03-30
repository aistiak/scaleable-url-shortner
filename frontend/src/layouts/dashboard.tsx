import axios from 'axios';
import './dashboard.css';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { AppContext } from '@/app/page';
function DashboardLayout({ children }: { children: any }) {
    // @ts-ignore
    const {context,setContext}  = useContext(AppContext)
    return (
        <div className="main">
            <div className="header">
                <div className="greet">Welcome Istiak </div>
                <div className="logout"> 
                <button onClick={async () => {
                    await axios({
                        url : `http://localhost:4002/api/logout` ,
                        method : 'GET',
                        withCredentials:true
                    })
                    setContext({user:null})
                }}>
                    {/* <a href="#" >logout</a> */}
                    logout
                </button>
                </div>
            </div>
            <div className="children">{children}</div>
        </div>
    )
}

export default DashboardLayout;