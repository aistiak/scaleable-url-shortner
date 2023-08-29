import { AppContext } from "@/app/page";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import Dashboard from "./dashboard";
import LoginPage from "./login";
// import LoginPage from "./login";
// import DashboardPage from "./dashboard2";
// import LoginPage from "./login";
// import Login from "./login";



const Home = () => {
    /***
     * check for login 
     * if success show dashboard page 
    */
    // @ts-ignore
    const { context } = useContext(AppContext)
  
    return (
        <div>

            {
                // context?.user ? <DashboardPage/> : <LoginPage/>
                !context?.user ?  <LoginPage/> : <Dashboard/> 
                
            }
        </div>
        // <Dashboard/>
        
    )
}

export default Home;