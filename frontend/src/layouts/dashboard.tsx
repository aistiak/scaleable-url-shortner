import './dashboard.css';

function DashboardLayout({ children }: { children: any }) {

    return (
        <div className="main">
            <div className="header">
                <div className="greet">Welcome Istiak </div>
                <div className="logout"> 
                    <a href="#" >logout</a>
                </div>
            </div>
            <div className="children">{children}</div>
        </div>
    )
}

export default DashboardLayout;